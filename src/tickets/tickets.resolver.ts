import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { TicketsService } from './tickets.service.js';
import { AddTicketsInput } from './tickets.dto.js';
import { UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { UserRole } from '../enums/user-role.js';

@Resolver()
export class TicketsResolver {
  constructor(private readonly ticketsService: TicketsService) {}

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => Boolean)
  async addTickets(@Args('input') input: AddTicketsInput) {
    await this.ticketsService.createMany(input);

    return true;
  }
}
