import { Field, InputType, Int } from "@nestjs/graphql";
import { UserRole } from "../enums/user-role.js";

@InputType()
export class UpdateUserRoleInput {
  @Field(() => Int)
  userId: number;

  @Field(() => UserRole)
  role: UserRole;
}