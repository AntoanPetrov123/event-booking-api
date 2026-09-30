import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class TicketInput {
    @Field()
    name: string;

    @Field()
    description: string;

    @Field()
    price: number;

    @Field({nullable: true})
    discountPrice: number;

    @Field(type => Int)
    totalPlaces: number;
}

@InputType()
export class AddTicketsInput {
    @Field(type => Int)
    eventId: number;

    @Field(type => [TicketInput])
    tickets: TicketInput[]
}