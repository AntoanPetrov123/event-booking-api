import { Module } from '@nestjs/common';
import { AdminService } from './admin.service.js';
import { AdminResolver } from './admin.resolver.js';
import { User } from '../users/entities/user.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [AdminService, AdminResolver]
})
export class AdminModule {}
