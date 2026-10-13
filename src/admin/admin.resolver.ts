import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AdminService } from './admin.service.js';
import { UpdateUserRoleInput } from './admin.dto.js';

@Resolver()
export class AdminResolver {
    constructor (private readonly adminServise: AdminService) {}

    @Mutation(() => Boolean)
    async updateUserRole(@Args('input') input: UpdateUserRoleInput) {
        const { userId, role } = input;
        await this.adminServise.updateUserRole(userId, role);

        return true;
    }
}
