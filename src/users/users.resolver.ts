import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { User, UserOrderItem } from './entities/user.entity.js';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard.js';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [UserOrderItem])
  @UseGuards(GqlAuthGuard)
  async getUserTickets(@CurrentUser() user: User) {
    return this.usersService.getUserTickets(user.id);
  }
}
