import { Controller, Get, Body, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CreateUserDto, LoginUserDto, ResetPasswordDto, ChangePasswordDto } from '../users/dto/user.dto';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) {}

    @Post('login')
    login(@Body() userDto: LoginUserDto) {
        return this.authService.login(userDto);
    }

    @Post('register')
    register(@Body() userDto: CreateUserDto) {
        return this.authService.register(userDto);
    }

    @Post('reset')
    reset(@Body() resetDto: ResetPasswordDto) {
        return this.authService.reset(resetDto);
    }

    @Post('change')
    change(@Body() changeDto: ChangePasswordDto) {
        return this.authService.change(changeDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async profile(@Request() req) {
        return req.user;
    }
}
