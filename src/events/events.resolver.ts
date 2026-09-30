import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { EventsService } from './events.service.js';
import { EventDTO, AddEventInput, GetEventsPayload, EventsDTO } from './events.dto.js';

@Resolver()
export class EventsResolver {
    constructor(private readonly eventsService: EventsService){}

    @Query(() => EventDTO)
    async getEvent(
        @Args('id', { type: () => Int }) id: number 
    ){
        return this.eventsService.findOneById(id);
    }

    @Mutation(() => Boolean)
    async addEvent(
        @Args('input', { type: () => AddEventInput }) input: AddEventInput 
    ){  
        this.eventsService.addEvent(input);

        return true;
        // return this.eventsService.findOneById(id);
    }

    @Query(() => EventsDTO)
    async getEvents(
        @Args('payload') payload: GetEventsPayload 
    ){        
        return await this.eventsService.findAll(payload);
    }
}
