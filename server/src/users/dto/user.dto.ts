import { IsEmail, IsNotEmpty, IsString, IsOptional, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty({ message: "Անունը պարտադիր է լրացման համար" })
    name: string;

    @IsEmail({ message: "Ոչ վալիդ Email հասցե" })
    email: string;

    @IsString()
    @IsNotEmpty({ message: "Գաղտնաբառը պարտադիր է լրացման համար" })
    @MinLength(6, { message: "Գաղտնաբառի երկարությունը պետք է լինի մինիմում 6 սիմվոլ" })
    password: string;

    @IsOptional()
    role: string;
}

export class UpdateUserDto {
    @IsNotEmpty({ message: "Անունը պարտադիր է լրացման համար" })
    name: string;

    @IsOptional()
    @IsString()
    @MinLength(6)
    password: string;

    @IsNotEmpty({ message: "Դերը պարտադիր է լրացման համար" })
    role: string;
}

export class LoginUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}

export class ResetPasswordDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;
}

export class ChangePasswordDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;

    @IsNotEmpty()
    @IsString()
    token: string;
}

export interface UserResponse {
    accessToken: string;
    id: string;
    email: string;
    name: string;
    role: string;
}