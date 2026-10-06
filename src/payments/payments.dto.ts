import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

@InputType()
export class CheckoutItemInput {
  @Field(() => Int)
  ticketId: number;

  @Field(() => Int)
  quantity: number;
}

@ObjectType()
export class CheckoutSessionPayload {
  @Field()
  checkoutUrl: string;
}
