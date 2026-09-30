import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity.js';
import { AddEventInput, GetEventsPayload } from './events.dto.js';

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

    return event;
  }

  async addEvent(input: AddEventInput) {
    const event = this.eventsRepository.create(input);

    return this.eventsRepository.save(event);
  }

  async findAll(payload: GetEventsPayload) {
    const { filter, pagination, search } = payload;
    const { city, hall, dateFrom, dateTo } = filter ?? {};
    const { page, sortBy, sortOrder, itemsPerPage } = pagination ?? {};

    const query = this.eventsRepository.createQueryBuilder('event');

    query.andWhere('event.status = :status', { status: 'ACTIVE' });

    if (city) {
      query.andWhere('event.city = :city', { city });
    }

    if (hall) {
      query.andWhere('event.hall = :hall', { hall });
    }

    if (dateFrom) {
      query.andWhere('event.startDate >= :dateFrom', {
        dateFrom,
      });
    }

    if (dateTo) {
      query.andWhere('event.startDate <= :dateTo', {
        dateTo,
      });
    }

    if (search) {
      query.andWhere(
        `(
            LOWER(event.title) LIKE LOWER(:search)
            OR LOWER(event.description) LIKE LOWER(:search)
            OR LOWER(event.city) LIKE LOWER(:search)
            OR LOWER(event.hall) LIKE LOWER(:search)
          )`,
        {
          search: `%${search}%`,
        },
      );
    }

    const allowedSortFields = [
      'title',
      'city',
      'hall',
      'startDate',
      'createdAt',
    ];

    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : 'startDate';

    const safeSortOrder = sortOrder === 'DESC' ? 'DESC' : 'ASC';

    query.orderBy(`event.${safeSortBy}`, safeSortOrder);

    query.skip((page - 1) * itemsPerPage).take(itemsPerPage);

    const [events, total] = await query.getManyAndCount();

    return {
      data: events,
      total,
      page,
      itemsPerPage,
      totalPages: Math.ceil(total / itemsPerPage),
    };
  }
}
