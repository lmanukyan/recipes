import { Controller, Post, Get, Put, Delete, Body, UseGuards, Query, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { UpdateUserDto, CreateUserDto } from './dto/user.dto';
import { RolesEnum } from './enums/roles.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';

@Controller('users')
export class UsersController {

    constructor(
        private readonly usersService: UsersService
    ) {}

    @UseGuards(RolesGuard)
    @Roles([RolesEnum.administrator, RolesEnum.moderator])
    @Post('create')
    create(@Body() userDto: CreateUserDto) {
        return this.usersService.create(userDto);
    }

    @UseGuards(RolesGuard)
    @Roles([RolesEnum.administrator])
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.usersService.delete(id);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    getAll(@Query() params): Promise<User[]> {
        console.log( params );
        return this.usersService.getAll(params)
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    getById(@Param('id') id: string) {
        return this.usersService.getById(id);
    }
}
