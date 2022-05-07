import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Type } from 'class-transformer';
import { User } from '../../users/schemas/user.schema';

@Schema({
	toJSON: { virtuals: true },
	timestamps: true
})
export class Category extends Document {
	@Prop()
	title: string;

	@Prop()
	slug: string;

	@Prop()
	description: string;

	@Prop({ type: Types.ObjectId, ref: User.name })
	@Type(() => User)
	author: Types.ObjectId;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
