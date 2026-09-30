import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service.js';
import { TicketsResolver } from './tickets.resolver.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity.js';
import { Event } from '../events/entities/event.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, Event])],
  providers: [TicketsService, TicketsResolver]
})
export class TicketsModule {}
