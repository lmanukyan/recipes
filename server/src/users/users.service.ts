import { Model } from 'mongoose';
import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { UpdateUserDto, CreateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

    constructor(
        @InjectModel(User.name) private userModel: Model<User>
    ) {}

    async create(userDto: CreateUserDto): Promise<User> {
        const registeredUser = await this.findByEmail(userDto.email);
        if(registeredUser){
            throw new HttpException('Email հասցեն արդեն զբաղված է', HttpStatus.BAD_REQUEST);
        }
        const hash: string = await this.getHashedPassword(userDto.password);
        const createdUser: User = new this.userModel({
            ...userDto,
            password: hash
        });
        return await createdUser.save();
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<any> {
        if(updateUserDto?.password){
            updateUserDto.password = await this.getHashedPassword(updateUserDto.password);
        }
        const updatedUser = await this.userModel.updateOne({_id: id}, updateUserDto);
        return updatedUser;
    }

    async updatePassword(id: string, password: string): Promise<any> {
        return await this.userModel.updateOne({_id: id}, {
            password: await this.getHashedPassword(password)
        });
    }

    async delete(id: string): Promise<any> {
        return await this.userModel.deleteOne({_id: id});
    }

    async getById(id: string): Promise<User> {
        return await this.userModel.findOne({_id: id});
    }

    async findByEmail(email: string): Promise<User> {
        return await this.userModel.findOne({email: email});
    }

    async getAll(params): Promise<any> {
        const users = await this.userModel
            .find(params.filters)
            .limit(params?.limit ? params.limit : 10)
            .skip(params?.skip ? params.skip : 0)
            .sort(params?.sort ? params.sort : {id: -1})

        const count = await this.userModel.count(params.filters)

        return {
            count: count,
            users: users,
        };
    }

    async getHashedPassword(password): Promise<string> {
        const salt: string = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }
}
