import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service.js';
import { AuthPayload, LoginInput, RegisterInput } from './auth.dto.js';
import { UseGuards } from '@nestjs/common';
import { User } from '../users/entities/user.entity.js';
import { GqlAuthGuard } from './guards/gql-auth.guard.js';
import { CurrentUser } from './decorators/current-user.decorator.js';

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Mutation(() => AuthPayload)
    async register(
        @Args('input', { type: () => RegisterInput }) input: RegisterInput
    ) {
        return this.authService.register(input);
    }

    @Mutation(() => AuthPayload)
    async login(
        @Args('input', { type: () => LoginInput }) input: LoginInput
    ) {
        console.log(input);
        
        return this.authService.login(input);
    }

    @Query(() => User)
    @UseGuards(GqlAuthGuard)
    me(@CurrentUser() user: User) {
        console.log(user);
        
        return user;
    }
}
