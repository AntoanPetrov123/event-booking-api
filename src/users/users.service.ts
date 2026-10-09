import { Injectable } from '@nestjs/common';
import { User, UserOrder, UserOrderItem } from './entities/user.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentStatus } from '../payments/payments.service.js';

type CreateUserInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(UserOrderItem)
    private readonly userOrderItemsRepository: Repository<UserOrderItem>,
  ) {}

  async create(input: CreateUserInput) {
    const user = this.usersRepository.create(input);

    return this.usersRepository.save(user);
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOneBy({
      email,
    });
  }

  async getUserTickets(userId: number) {
    return this.userOrderItemsRepository
      .createQueryBuilder('item')
      .innerJoin(UserOrder, 'order', 'order.id = item.orderId')
      .leftJoinAndSelect('item.event', 'event')
      .where('order.userId = :userId', { userId })
      .andWhere('order.paymentStatus = :paymentStatus', {
        paymentStatus: PaymentStatus.PAID,
      })
      .orderBy('order.createdAt', 'DESC')
      .getMany();
  }
}
