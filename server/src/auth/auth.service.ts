import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { LoginUserDto, CreateUserDto, ResetPasswordDto, ChangePasswordDto } from '../users/dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { User } from '../users/schemas/user.schema';
import { RolesEnum } from '../users/enums/roles.enum';
import * as bcrypt from 'bcrypt';

interface UserResponse {
    accessToken: string;
    id: string;
    email: string;
    name: string;
    role: string;
}

@Injectable()
export class AuthService {

    private user: User

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private mailService: MailService,
    ) {}

    async register(userDto: CreateUserDto): Promise<UserResponse> {
        const user: User = await this.usersService.create({
            ...userDto,
            role: RolesEnum.editor
        });
        return await this.generateToken(user);
    }

    async login(userDto: LoginUserDto): Promise<UserResponse> {
        const user: User = await this.validateUser(userDto);
        return await this.generateToken(user);
    }

    private async generateToken(user: User): Promise<UserResponse> {
        const payload = { email: user.email, id: user.id, role: user.role };
        return {
            accessToken: this.jwtService.sign(payload),
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        }
    }

    private async validateUser(userDto: LoginUserDto): Promise<User> {
        const user: User = await this.usersService.findByEmail(userDto.email);
        if(user !== null){
            const passwordEquals = await bcrypt.compare(userDto.password, user.password);
            if(passwordEquals)
                return user;
        }
        throw new UnauthorizedException({message: 'Սխալ Email կամ գաղտնաբառ'});
    }

    async reset(resetDto: ResetPasswordDto): Promise<{message: string}> {
        const user: User = await this.usersService.findByEmail(resetDto.email);

        if(user === null){
            throw new NotFoundException('Չի գտնվել');
        }

        const passwordResetToken = this.jwtService.sign({
            secret: process.env.APP_SECRET,
            email: user.email,
        })

        try{
            await this.mailService.sendResetPasswordLink(user, passwordResetToken);
            return {message: 'Հաջողությամբ ուղարկվեց․'};
        } catch(e){
            throw new BadRequestException('Հարցումը հնարավոր չէ կատարել, խնդրում ենք փորձել ավելի ուշ․');
        }
    }

    async change(changeDto: ChangePasswordDto): Promise<{message: string}> {
        try{
            const data = this.jwtService.verify(changeDto.token);
            const user: User = await this.usersService.findByEmail(data.email);
            await this.usersService.updatePassword(user._id, changeDto.password);
            return {message: 'Գաղտնաբառը հաջողությամբ փոխվեց․'};
        } catch(e){
            throw new BadRequestException('Սեսիան լրացել է․ Խնդրում ենք ուղարկել գաղտնաբառի վերականգնման նոր հարցում․');
        }
    }
}

