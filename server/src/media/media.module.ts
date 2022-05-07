import { Module } from '@nestjs/common';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { Media, MediaSchema } from './schemas/media.schema';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from '../auth/auth.module';
import { uploadsPath } from './utils';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Media.name, schema: MediaSchema },
        ]),
        MulterModule.register({
            dest: uploadsPath()
        }),
        AuthModule
    ],
    controllers: [MediaController],
    providers: [MediaService]
})
export class MediaModule {}
