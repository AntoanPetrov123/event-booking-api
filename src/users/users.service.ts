import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

type CreateUserInput = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
      ) {}

    async create(input: CreateUserInput) {
        const user = this.usersRepository.create(input);

        return this.usersRepository.save(user);
    }

    async findByEmail(email: string) {
        return this.usersRepository.findOneBy({
            email
        });
    }
}
