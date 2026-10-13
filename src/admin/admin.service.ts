import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity.js';
import { Repository } from 'typeorm';
import { UserRole } from '../enums/user-role.js';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async updateUserRole(userId: number, role: UserRole) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    user.role = role;

    return this.usersRepository.save(user);
  }

  async updateUserEmail(userId: number, email: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    user.email = email;

    return this.usersRepository.save(user);
  }
}
