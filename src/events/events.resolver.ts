import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { EventsService } from './events.service.js';
import {
  EventDTO,
  AddEventInput,
  GetEventsPayload,
  EventsDTO,
  UpdateEventInput,
} from './events.dto.js';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { UserRole } from '../enums/user-role.js';

@Resolver()
export class EventsResolver {
  constructor(private readonly eventsService: EventsService) {}

  @Query(() => EventDTO)
  async getEvent(@Args('id', { type: () => Int }) id: number) {
    return this.eventsService.findOneById(id);
  }

  @Query(() => EventsDTO)
  async getEvents(
    @Args('payload', { type: () => GetEventsPayload })
    payload: GetEventsPayload,
  ) {
    return await this.eventsService.findAll(payload);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => Boolean)
  async addEvent(
    @Args('input', { type: () => AddEventInput }) input: AddEventInput,
  ) {
    this.eventsService.addEvent(input);

    return true;
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => Boolean)
  async updateEvent(
    @Args('input', { type: () => UpdateEventInput }) input: UpdateEventInput,
  ) {
    await this.eventsService.updateEvent(input);

    return true;
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => Boolean)
  async deleteEvent(@Args('eventId', { type: () => Int }) eventId: number) {
    await this.eventsService.deleteEvent(eventId);

    return true;
  }
}
