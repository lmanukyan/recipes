import { Controller, Param, Get, Post, UploadedFile, UseInterceptors, UseGuards, Query, Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { RolesEnum } from '../users/enums/roles.enum';
import { diskStorage } from 'multer';
import { makeFileName, uploadsPath } from './utils';

@Controller('media')
export class MediaController {

    constructor(
        private readonly mediaService: MediaService
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post('upload')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({ destination: uploadsPath(), filename: makeFileName })
        })
    )
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        return this.mediaService.create(file);
    }

    @UseGuards(RolesGuard)
    @Roles([RolesEnum.administrator, RolesEnum.moderator])
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.mediaService.delete(id);
    }

    @Get()
    getAll(@Query() params) {
        return this.mediaService.getAll(params);
    }

}
