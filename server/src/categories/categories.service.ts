import { Model, Types } from 'mongoose';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { RolesEnum } from '../users/enums/roles.enum';
import { slugconverter } from '../utils/slugconverter';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectModel(Category.name) private categoryModel: Model<Category>
    ) {}

    async create(categoryDto: CreateCategoryDto, user): Promise<Category> {
        const createdCategory: Category = new this.categoryModel({
            ...categoryDto,
            slug: await this.uniqueSlug(categoryDto),
            author: new Types.ObjectId(user.id)
        });
        return await createdCategory.save();
    }

    async update(id: string, categoryDto: CreateCategoryDto, user): Promise<any> {
        await this.checkPermissions(id, user);
        const updatedCategory = await this.categoryModel.updateOne({_id: id}, {
            ...categoryDto,
            slug: await this.uniqueSlug(categoryDto, id),
        });
        return updatedCategory;
    }

    async delete(id: string): Promise<any> {
        const deleted = await this.categoryModel.deleteOne({_id: id});
        return deleted;
    }

    async getById(id: string): Promise<Category> {
        const category: Category = await this.categoryModel.findOne({_id: id})
            .populate({ path: 'author', select: 'name' })
        
        if(category === null){
            throw new NotFoundException();
        }
        
        return category;
    }

    async getAll(params): Promise<{categories: Category[], count: number}> {
        const categories: Category[] = await this.categoryModel
            .find(params.filters)
            .limit(params?.limit ? params.limit : 10)
            .skip(params?.skip ? params.skip : 0)
            .sort(params?.sort ? params.sort : {createdAt: -1})
            .populate({ path: 'author', select: 'name' })

        const count: number = await this.categoryModel.count(params.filters)

        return {
            categories: categories,
            count: count
        };
    }

    async checkPermissions(id, user): Promise<boolean> {
        if(user.role === RolesEnum.administrator || user.role === RolesEnum.moderator) {
            return true;
        }

        const category: Category = await this.categoryModel.findOne({
            _id: new Types.ObjectId(id),
            author: new Types.ObjectId(user.id),
        });

        if(category === null){
            throw new UnauthorizedException({
                message: 'Դուք չունեք այս էջը դիտելու թույլտվություն'
            });
        }

        return true;
    }

    async uniqueSlug(category: CreateCategoryDto, id: string|null = null): Promise<string> {
        let slug = slugconverter(category.slug ? category.slug : category.title);
        let exists = await this.categoryModel.findOne({slug: slug, _id: { $ne: id } });
        let suffix_index = 1;
        while(exists){
            slug = `${slug}_${suffix_index}`;
            exists = await this.categoryModel.findOne({slug: slug, _id: { $ne: id } });
        }
        return slug;
    }
}
