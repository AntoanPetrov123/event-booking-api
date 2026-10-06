import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PaymentsService } from './payments.service.js';
import { PaymentsResolver } from './payments.resolver.js';

import { Ticket } from '../tickets/entities/ticket.entity.js';
import { UserOrder, UserOrderItem } from '../users/entities/user.entity.js';
import { PaymentsController } from './payments.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, UserOrder, UserOrderItem,])],
  providers: [PaymentsService, PaymentsResolver,],
  controllers: [PaymentsController,],
})
export class PaymentsModule {}
