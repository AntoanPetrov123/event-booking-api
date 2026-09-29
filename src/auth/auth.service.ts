import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginInput, RegisterInput } from './auth.dto.js';
import { UsersService } from '../users/users.service.js';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor (
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async register(input: RegisterInput) {
        const existingUser = await this.usersService.findByEmail(input.email);

        if (existingUser) {
            throw new ConflictException('Email is already taken');
        }

        const hashedPassword = await bcrypt.hash(input.password, 10);

        const user = await this.usersService.create({
            ...input,
            password: hashedPassword,
        });

        const accessToken = await this.jwtService.signAsync({
            sub: user.id,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
        });
        
        return {
            user,
            accessToken,
        };
    }

    async login(input: LoginInput) {
        const user = await this.usersService.findByEmail(input.email);

        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(
            input.password,
            user.password,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const accessToken = await this.jwtService.signAsync({
            sub: user.id,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
        });
        
        return {
            user,
            accessToken,
        };
    }
}
