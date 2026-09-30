import { Injectable, NotFoundException } from '@nestjs/common';
import { AddTicketsInput } from './tickets.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity.js';
import { Repository } from 'typeorm';
import { Event } from '../events/entities/event.entity.js';

@Injectable()
export class TicketsService {
    constructor(
        @InjectRepository(Ticket)
        private readonly ticketsRepository: Repository<Ticket>,
        @InjectRepository(Event)
        private readonly eventsRepository: Repository<Event>,
      ) {}

    async createMany(input: AddTicketsInput) {
        const { eventId, tickets } = input;

        const event = await this.eventsRepository.findOne({
            where: { id: eventId },
        });

        if (!event) {
            throw new NotFoundException(`Event with id ${eventId} not found`);
        }

        const newTickets = tickets.map((ticket) =>
            this.ticketsRepository.create({
                ...ticket,
                eventId,
            })
        );

        return this.ticketsRepository.save(newTickets);
    }
}
