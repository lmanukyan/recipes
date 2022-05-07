import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Recipe } from './schemas/recipe.schema';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { RolesEnum } from '../users/enums/roles.enum';
import { slugconverter } from '../utils/slugconverter';


import dataIngr from './ingr'

@Injectable()
export class RecipesService {
    constructor(
        @InjectModel(Recipe.name) private recipeModel: Model<Recipe>,
    ) {}

    async create(recipeDto: CreateRecipeDto, user: any): Promise<Recipe> {
        const createdRecipe: Recipe = new this.recipeModel({
            ...recipeDto,
            slug: await this.uniqueSlug(recipeDto),
            author: new Types.ObjectId(user.id),
        });
        return await createdRecipe.save();
    }

    async update(id: string, recipeDto: CreateRecipeDto, user): Promise<any> {
        await this.checkPermissions(id, user);
        const updatedRecipe = await this.recipeModel.updateOne({_id: id}, {
            ...recipeDto,
            slug: await this.uniqueSlug(recipeDto, id),
        });
        return updatedRecipe;
    }

    async delete(id: string, user): Promise<any> {
        await this.checkPermissions(id, user);
        const deleted = await this.recipeModel.deleteOne({_id: id});
        return deleted;
    }

    async getById(id: string): Promise<Recipe> {
        const recipe: Recipe = await this.recipeModel.findOne({_id: id})
            .populate('categories')
            .populate('thumbnail')
            .populate({ path: 'author', select: 'name' })

        if(recipe === null){
            throw new NotFoundException('Չի գտնվել');
        }

        return recipe; 
    }
    
    async getBySlug(slug: string): Promise<Recipe> {
        const recipe: Recipe = await this.recipeModel.findOne({slug: slug})
            .populate('categories')
            .populate('thumbnail')
            .populate({ path: 'author', select: 'name' })

        if(recipe === null){
            throw new NotFoundException('Չի գտնվել');
        }

        return recipe; 
    }

    async getAll(params): Promise<{count: number, recipes: Recipe[]}> {
        console.log(params);
        const recipes = await this.recipeModel
        .find(params.filters)
        .limit(params?.limit ? params.limit : 10)
        .skip(params?.skip ? params.skip : 0)
        .sort(params?.sort ? params.sort : {createdAt: -1})
        .populate('categories')
        .populate('thumbnail')
        .populate({ path: 'author', select: 'name' })

        const count = await this.recipeModel.count(params.filters)

        return {
            count: count,
            recipes: recipes,
        };
    }

    async checkPermissions(id: string, user): Promise<boolean> {
        if(user.role === RolesEnum.administrator || user.role === RolesEnum.moderator) {
            return true;
        }

        const recipe: Recipe = await this.recipeModel.findOne({
            _id: new Types.ObjectId(id),
            author: new Types.ObjectId(user.id),
        });

        if(recipe === null){
            throw new UnauthorizedException({
                message: 'Դուք չունեք այս էջը դիտելու թույլտվություն'
            });
        }

        return true;
    }

    async uniqueSlug(recipe: CreateRecipeDto, id: string|null = null): Promise<string> {
        let slug = slugconverter(recipe.slug ? recipe.slug : recipe.title);
        let exists = await this.recipeModel.findOne({slug: slug, _id: { $ne: id } });
        let suffix_index = 1;
        while(exists){
            slug = `${slug}_${suffix_index}`;
            exists = await this.recipeModel.findOne({slug: slug, _id: { $ne: id } });
        }
        return slug;
    }

    async transform() {
        let notFound = [];
        for(let ingredientId of dataIngr){
            let recipe = await this.recipeModel.findOne({
                "ingredients.type": "ingredient",
                "ingredients.value": ingredientId,
            })
            if(!recipe){
                notFound.push(ingredientId)
            }
        }

        return notFound;
    }

}
