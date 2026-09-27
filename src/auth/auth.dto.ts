import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { User } from "../users/entities/user.entity.js";

@InputType()
export class RegisterInput {
    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field()
    email: string;

    @Field()
    password: string;
}

@InputType()
export class LoginInput {
    @Field()
    email: string;

    @Field()
    password: string;
}

@ObjectType()
export class AuthPayload {
    @Field()
    accessToken: string;
  
    @Field(() => User)
    user: User;
}