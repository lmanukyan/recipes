import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { IngredientsController } from './ingredients.controller';
import { IngredientsService } from './ingredients.service';
import { IngredientSchema, Ingredient } from './schemas/ingredient.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Ingredient.name, schema: IngredientSchema },
        ]),
        AuthModule
    ],
    controllers: [IngredientsController],
    providers: [IngredientsService]
})
export class IngredientsModule {}
