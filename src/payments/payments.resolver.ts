import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';

import { PaymentsService } from './payments.service.js';
import { CheckoutItemInput, CheckoutSessionPayload } from './payments.dto.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { User, UserOrder } from '../users/entities/user.entity.js';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard.js';
import { UseGuards } from '@nestjs/common';

@Resolver()
export class PaymentsResolver {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => CheckoutSessionPayload)
  createCheckoutSession(
    @Args('input', {
      type: () => [CheckoutItemInput],
    })
    input: CheckoutItemInput[],
    @CurrentUser() user: User,
  ) {
    return this.paymentsService.createCheckoutSession(input, user);
  }

  @Query(() => UserOrder)
  @UseGuards(GqlAuthGuard)
  async getPaymentStatus(
    @Args('sessionId')
    sessionId: string,
    @CurrentUser()
    user: User,
  ) {
    return this.paymentsService.getOrderByStripeSession(sessionId, user.id);
  }
}
