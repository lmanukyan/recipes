import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Media } from './schemas/media.schema';
import { urlPath } from './utils';
import { promises as fs } from 'fs';

@Injectable()
export class MediaService {
    constructor(
        @InjectModel(Media.name) private mediaModel: Model<Media>
    ) {}

    async create(file): Promise<Media> {
        const createdMedia: Media = new this.mediaModel({
            path: urlPath(file.path),
            mimetype: file.mimetype,
        });
        return await createdMedia.save();
    }

    async getAll(params): Promise<Media[]> {
        console.log(params);
        const medias: Media[] = await this.mediaModel
        .find(params.filter)
        .sort({createdAt: -1})
        .limit(params?.limit ? params.limit : 30)
        .skip(params?.skip ? params.skip : 0)

        return medias;
    }

    async delete(id): Promise<Boolean> {
        const media = await this.mediaModel.findOne({_id: id});
        try{
            await fs.unlink(media.path);
            await this.mediaModel.deleteOne({_id: id});
            return true;
        } catch(e) {
            console.log(e)
        }
        return false;
    }
}
