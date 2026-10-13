import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PaymentsService } from './payments.service.js';
import { PaymentsResolver } from './payments.resolver.js';

import { Ticket } from '../tickets/entities/ticket.entity.js';
import { User, UserOrder, UserOrderItem } from '../users/entities/user.entity.js';
import { PaymentsController } from './payments.controller.js';
import { IssuedTicket } from '../tickets/entities/issued-ticket.entity.js';
import { QrService } from '../tickets/qr.service.js';
import { MailService } from '../mail/mail.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([IssuedTicket, Ticket, User, UserOrder, UserOrderItem,])],
  providers: [MailService, PaymentsService, PaymentsResolver, QrService,],
  controllers: [PaymentsController,],
})
export class PaymentsModule {}
