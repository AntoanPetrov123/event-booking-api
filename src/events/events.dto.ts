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