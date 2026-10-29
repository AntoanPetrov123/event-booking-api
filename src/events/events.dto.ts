import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

import type { Relation } from 'typeorm';
import { Ticket } from '../tickets/entities/ticket.entity.js';

@ObjectType()
export class EventDTO {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field()
  hall: string;

  @Field()
  city: string;

  @Field()
  description: string;

  @Field()
  startDate: string;

  @Field()
  endDate: string;

  @Field()
  startTime: string;

  @Field()
  endTime: string;

  @Field()
  image: string;

  @Field()
  status: string;

  @Field(() => [Ticket], { nullable: true })
  tickets?: Relation<Ticket[]>;
}

@InputType()
export class AddEventInput {
  @Field()
  title: string;

  @Field()
  hall: string;

  @Field()
  city: string;

  @Field()
  description: string;

  @Field(() => String)
  startDate: string;

  @Field(() => String)
  endDate: string;

  @Field()
  startTime: string;

  @Field()
  endTime: string;

  @Field()
  image: string;

  @Field()
  status: string;
}

@InputType()
export class GetEventsFilter {
  @Field(() => String, { nullable: true })
  city?: string;

  @Field(() => String, { nullable: true })
  hall?: string;

  @Field(() => String, { nullable: true })
  dateFrom?: string;

  @Field(() => String, { nullable: true })
  dateTo?: string;

  @Field(() => String, { nullable: true })
  status?: string;
}

@InputType()
export class GetEventsPagination {
  @Field()
  page: number;

  @Field()
  sortBy: string;

  @Field()
  sortOrder: string;

  @Field()
  itemsPerPage: number;
}

@InputType()
export class GetEventsPayload {
  @Field()
  filter: GetEventsFilter;

  @Field()
  pagination: GetEventsPagination;

  @Field(() => String, { nullable: true })
  search?: string;

  @Field()
  listKey?: string;
}

@ObjectType()
export class ListEventDTO {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field()
  hall: string;

  @Field()
  city: string;

  @Field()
  startDate: string;

  @Field()
  endDate: string;

  @Field()
  startTime: string;

  @Field()
  endTime: string;

  @Field()
  image: string;

  @Field(() => String, { nullable: true })
  status: string;
}

@ObjectType()
export class EventsDTO {
  @Field(() => [ListEventDTO], { nullable: true })
  data?: ListEventDTO[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  itemsPerPage: number;

  @Field(() => Int)
  totalPages: number;

  @Field()
  listKey: string;
}

@InputType()
export class UpdateEventInput extends AddEventInput {
  @Field(() => Int)
  id: number;
}
