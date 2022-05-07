import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RecipesModule } from './recipes/recipes.module';
import { CategoriesModule } from './categories/categories.module';
import { IngredientsModule } from './ingredients/ingredients.module';
import { MediaModule } from './media/media.module';
import { MailModule } from './mail/mail.module';
import { join } from 'path';

@Module({
    imports: [
        ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
        MongooseModule.forRoot(`mongodb://${process.env.DBHOST}/${process.env.DBNAME}`),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '../..', 'client/build'),
        }),
        UsersModule,
        AuthModule,
        RecipesModule,
        CategoriesModule,
        IngredientsModule,
        MediaModule,
        MailModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}

