import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service.js';
import { AuthPayload, LoginInput, RegisterInput } from './auth.dto.js';

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
}
