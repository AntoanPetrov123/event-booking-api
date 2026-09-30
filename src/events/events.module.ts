import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Event } from './entities/event.entity.js';
import { EventsResolver } from './events.resolver.js';
import { EventsService } from './events.service.js';
import { Ticket } from '../tickets/entities/ticket.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Ticket])],
  providers: [EventsResolver, EventsService],
})
export class EventsModule {}
