import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';

import Stripe from 'stripe';

import { Ticket } from '../tickets/entities/ticket.entity.js';
import { CheckoutItemInput } from './payments.dto.js';
import {
  User,
  UserOrder,
  UserOrderItem,
} from '../users/entities/user.entity.js';
import { DataSource } from 'typeorm';
import { Cron } from '@nestjs/schedule';

export enum OrderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
}

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(Ticket)
    private readonly ticketsRepository: Repository<Ticket>,

    @InjectRepository(UserOrder)
    private readonly ordersRepository: Repository<UserOrder>,

    private readonly dataSource: DataSource,
  ) {
    this.stripe = new Stripe(
      this.configService.getOrThrow<string>('STRIPE_SECRET_KEY'),
    );
  }

  async createCheckoutSession(input: CheckoutItemInput[], user: User) {
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const item of input) {
      const ticket = await this.ticketsRepository.findOne({
        where: {
          id: item.ticketId,
        },
      });

      if (!ticket) {
        throw new BadRequestException(`Ticket ${item.ticketId} not found`);
      }

      if (item.quantity <= 0) {
        throw new BadRequestException('Invalid ticket quantity');
      }

      const availablePlaces =
        ticket.totalPlaces - ticket.usedPlaces - ticket.reservedPlaces;

      if (item.quantity > availablePlaces) {
        throw new BadRequestException(
          `Not enough tickets available for ${ticket.name}`,
        );
      }

      const price = ticket.discountPrice ?? ticket.price;

      lineItems.push({
        quantity: item.quantity,

        price_data: {
          currency: 'eur',

          unit_amount: Math.round(Number(price) * 100),

          product_data: {
            name: ticket.name,
          },
        },
      });
    }

    const order = await this.createPendingOrderAndReserve(user.id, input);

    try {
      const session = await this.createStripeSession(order);

      await this.ordersRepository.update(order.id, {
        stripeSessionId: session.id,
      });

      return {
        checkoutUrl: session.url,
      };
    } catch (error) {
      await this.cancelOrderAndReleaseReservation(order.id);

      throw error;
    }
  }

  async createPendingOrderAndReserve(
    userId: number,
    input: CheckoutItemInput[],
  ) {
    return this.dataSource.transaction(async (manager) => {
      const orderRepository = manager.getRepository(UserOrder);

      const orderItemsRepository = manager.getRepository(UserOrderItem);

      const ticketRepository = manager.getRepository(Ticket);

      let totalAmount = 0;

      const orderItems: UserOrderItem[] = [];

      /*
       * Първо проверяваме всички tickets.
       */
      for (const item of input) {
        if (item.quantity <= 0) {
          throw new BadRequestException('Invalid quantity');
        }

        const ticket = await ticketRepository.findOne({
          where: {
            id: item.ticketId,
          },

          /*
           * Заключваме реда докато transaction-а приключи.
           */
          lock: {
            mode: 'pessimistic_write',
          },
        });

        if (!ticket) {
          throw new NotFoundException(`Ticket ${item.ticketId} not found`);
        }

        const availablePlaces =
          ticket.totalPlaces - ticket.usedPlaces - ticket.reservedPlaces;

        if (item.quantity > availablePlaces) {
          throw new BadRequestException(
            `Not enough available places for ${ticket.name}`,
          );
        }

        const unitPrice = Number(ticket.discountPrice ?? ticket.price);

        const itemTotal = unitPrice * item.quantity;

        totalAmount += itemTotal;

        /*
         * Резервираме местата.
         */
        ticket.reservedPlaces += item.quantity;

        await ticketRepository.save(ticket);

        /*
         * Подготвяме order item.
         */
        const orderItem = orderItemsRepository.create({
          ticketId: ticket.id,
          eventId: ticket.eventId,

          ticketName: ticket.name,

          quantity: item.quantity,

          unitPrice,
          totalPrice: itemTotal,
        });

        orderItems.push(orderItem);
      }

      /*
       * Създаваме самата поръчка.
       */
      const order = orderRepository.create({
        userId,

        status: OrderStatus.PENDING,

        paymentStatus: PaymentStatus.PENDING,

        totalAmount,

        currency: 'EUR',

        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      });

      const savedOrder = await orderRepository.save(order);

      /*
       * Свързваме items към order-а.
       */
      for (const item of orderItems) {
        item.orderId = savedOrder.id;
      }

      await orderItemsRepository.save(orderItems);

      return {
        ...savedOrder,
        items: orderItems,
      };
    });
  }

  async createStripeSession(
    order: UserOrder & {
      items: UserOrderItem[];
    },
  ) {
    const frontendUrl = this.configService.getOrThrow<string>('FRONTEND_URL');

    const lineItems = order.items.map((item) => ({
      quantity: item.quantity,

      price_data: {
        currency: 'eur',

        unit_amount: Math.round(Number(item.unitPrice) * 100),

        product_data: {
          name: item.ticketName,
        },
      },
    }));

    return this.stripe.checkout.sessions.create({
      mode: 'payment',

      line_items: lineItems,

      success_url: `${frontendUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${frontendUrl}/cart`,

      metadata: {
        orderId: order.id.toString(),

        userId: order.userId.toString(),
      },
    });
  }

  async cancelOrderAndReleaseReservation(orderId: number) {
    await this.dataSource.transaction(async (manager) => {
      const orderRepository = manager.getRepository(UserOrder);

      const itemRepository = manager.getRepository(UserOrderItem);

      const ticketRepository = manager.getRepository(Ticket);

      const order = await orderRepository.findOne({
        where: {
          id: orderId,
        },
      });

      if (!order) return;

      const items = await itemRepository.find({
        where: {
          orderId,
        },
      });

      for (const item of items) {
        const ticket = await ticketRepository.findOne({
          where: {
            id: item.ticketId,
          },

          lock: {
            mode: 'pessimistic_write',
          },
        });

        if (!ticket) {
          continue;
        }

        ticket.reservedPlaces = Math.max(
          0,
          ticket.reservedPlaces - item.quantity,
        );

        await ticketRepository.save(ticket);
      }

      order.status = OrderStatus.CANCELLED;

      order.paymentStatus = PaymentStatus.FAILED;

      await orderRepository.save(order);
    });
  }

  async handleWebhook(rawBody: Buffer, signature: string) {
    const webhookSecret = this.configService.getOrThrow<string>(
      'STRIPE_WEBHOOK_SECRET',
    );

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret,
      );
    } catch (error) {
      throw new BadRequestException('Invalid Stripe webhook signature');
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        await this.completeOrder(session);

        break;
      }

      default:
        console.log(`Unhandled Stripe event: ${event.type}`);
    }

    return {
      received: true,
    };
  }

  async completeOrder(session: Stripe.Checkout.Session) {
    const orderId = Number(session.metadata?.orderId);

    if (!orderId) {
      throw new BadRequestException('Missing orderId in Stripe metadata');
    }

    await this.dataSource.transaction(async (manager) => {
      const orderRepository = manager.getRepository(UserOrder);

      const orderItemsRepository = manager.getRepository(UserOrderItem);

      const ticketRepository = manager.getRepository(Ticket);

      const order = await orderRepository.findOne({
        where: {
          id: orderId,
        },

        lock: {
          mode: 'pessimistic_write',
        },
      });

      if (!order) {
        throw new NotFoundException(`Order ${orderId} not found`);
      }

      if (order.paymentStatus === PaymentStatus.PAID) {
        return;
      }

      const orderItems = await orderItemsRepository.find({
        where: {
          orderId,
        },
      });

      for (const item of orderItems) {
        const ticket = await ticketRepository.findOne({
          where: {
            id: item.ticketId,
          },

          lock: {
            mode: 'pessimistic_write',
          },
        });

        if (!ticket) {
          throw new NotFoundException(`Ticket ${item.ticketId} not found`);
        }

        ticket.reservedPlaces = Math.max(
          0,
          ticket.reservedPlaces - item.quantity,
        );

        ticket.usedPlaces += item.quantity;

        await ticketRepository.save(ticket);
      }

      order.status = OrderStatus.COMPLETED;

      order.paymentStatus = PaymentStatus.PAID;

      if (typeof session.payment_intent === 'string') {
        order.stripePaymentIntentId = session.payment_intent;
      }

      await orderRepository.save(order);
    });
  }

  @Cron('*/1 * * * *')
  async handleExpiredReservations() {
    await this.releaseExpiredReservations();
  }

  async releaseExpiredReservations() {
    const now = new Date();

    const expiredOrders = await this.ordersRepository.find({
      where: {
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        expiresAt: LessThan(now),
      },
    });

    for (const order of expiredOrders) {
      await this.cancelOrderAndReleaseReservation(order.id);
    }
  }
}
