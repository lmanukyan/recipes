import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CategorySchema, Category } from './schemas/category.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Category.name, schema: CategorySchema },
        ]),
        AuthModule
    ],
    controllers: [CategoriesController],
    providers: [CategoriesService],
    exports: [CategoriesService],
})
export class CategoriesModule {}
