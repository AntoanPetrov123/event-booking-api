import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { TicketsService } from './tickets.service.js';
import { AddTicketsInput } from './tickets.dto.js';

@Resolver()
export class TicketsResolver {
    constructor(private readonly ticketsService: TicketsService){}

    @Mutation(()=> Boolean )
    async createTickets(@Args('input') input: AddTicketsInput) {
        this.ticketsService.createMany(input);
        return true;
    }
}
