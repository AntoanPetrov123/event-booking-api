import { Module } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UsersResolver } from './users.resolver.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { Ticket } from '../tickets/entities/ticket.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([User, Ticket])],
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
