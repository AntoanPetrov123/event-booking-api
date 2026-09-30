import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class EventDTO {
    @Field(type => Int)
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
}

@ObjectType()
export class ListEventDTO {
    @Field(type => Int)
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
}

@ObjectType()
export class EventsDTO {
    @Field(type => [ListEventDTO], { nullable: true })
    data?: ListEventDTO[];

    @Field(type => Int)
    total: number;

    @Field(type => Int)
    page: number;

    @Field(type => Int)
    itemsPerPage: number;

    @Field(type => Int)
    totalPages: number;
}