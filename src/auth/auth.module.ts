import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthResolver } from './auth.resolver.js';
import { UsersModule } from '../users/users.module.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy.js';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '15m',
        },
      }),
    }),
  ],
  providers: [
    AuthService, 
    AuthResolver,
    JwtStrategy,
  ]
})
export class AuthModule {}
