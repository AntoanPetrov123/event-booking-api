import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Event } from './entities/event.entity.js';
import { EventsResolver } from './events.resolver.js';
import { EventsService } from './events.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  providers: [EventsResolver, EventsService],
})
export class EventsModule {}
