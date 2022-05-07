import { Model, Types } from 'mongoose';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Ingredient } from './schemas/ingredient.schema';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { RolesEnum } from '../users/enums/roles.enum';

@Injectable()
export class IngredientsService {
    constructor(
        @InjectModel(Ingredient.name) private ingredientModel: Model<Ingredient>
    ) {}

    async create(ingredientDto: CreateIngredientDto, user): Promise<Ingredient> {
        const createdIngredient: Ingredient = new this.ingredientModel({
            ...ingredientDto,
            author: new Types.ObjectId(user.id)
        });
        return await createdIngredient.save();
    }

    async update(id: string, ingredientDto: CreateIngredientDto, user): Promise<any> {
        await this.checkPermissions(id, user);
        const updatedIngredient = await this.ingredientModel.updateOne({_id: id}, ingredientDto);
        return updatedIngredient;
    }

    async delete(id: string): Promise<any> {
        const deleted = await this.ingredientModel.deleteOne({_id: id});
        return deleted;
    }

    async getById(id: string): Promise<Ingredient> {
        const ingredient: Ingredient = await this.ingredientModel.findOne({_id: id})
            .populate({ path: 'author', select: 'name' })
        
        if(ingredient === null){
            throw new NotFoundException('Չի գտնվել');
        }

        return ingredient;
    }

    async getLabels(ids: string[]): Promise<Ingredient[]> {
        return await this.ingredientModel.find({_id: {$in: ids} }).select('title');
    }

    async getAll(params): Promise<{ingredients: Ingredient[], count: number}> {
        const ingredients: Ingredient[] = await this.ingredientModel
            .find(params.filters)
            .limit(params?.limit ? params.limit : 10)
            .skip(params?.skip ? params.skip : 0)
            .sort(params?.sort ? params.sort : {createdAt: -1})
            .populate({ path: 'author', select: 'name' })

        const count: number = await this.ingredientModel.count(params.filters)

        return {
            ingredients: ingredients,
            count: count
        };
    }

    async checkPermissions(id, user): Promise<boolean> {
        if(user.role === RolesEnum.administrator || user.role === RolesEnum.moderator) {
            return true;
        }

        const ingredient: Ingredient = await this.ingredientModel.findOne({
            _id: new Types.ObjectId(id),
            author: new Types.ObjectId(user.id),
        });

        if(ingredient === null){
            throw new UnauthorizedException({
                message: 'Դուք չունեք այս էջը դիտելու թույլտվություն'
            });
        }

        return true;
    }
}
