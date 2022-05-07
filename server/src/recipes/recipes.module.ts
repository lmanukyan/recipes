import { Module } from '@nestjs/common';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { RecipeSchema, Recipe } from './schemas/recipe.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Recipe.name,
                schema: RecipeSchema
            }
        ]),
        AuthModule
    ],
    controllers: [RecipesController],
    providers: [RecipesService]
})
export class RecipesModule {}
