import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity.js';
import { AddEventInput } from './events.dto.js';

@Injectable()
export class EventsService {

    constructor(
        @InjectRepository(Event)
        private readonly eventsRepository: Repository<Event>,
      ) {}

    async findOneById(id: number) {
        const event = await this.eventsRepository.findOne({
          where: { id },
        });
      
        if (!event) {
          throw new NotFoundException(`Event with id ${id} not found`);
        }
      
        console.log(event);
        
        return event;
    }

    async addEvent(input: AddEventInput) {
        const event = this.eventsRepository.create(input);
      
        return this.eventsRepository.save(event);
    }
}
