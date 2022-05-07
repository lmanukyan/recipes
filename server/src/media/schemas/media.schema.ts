import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
	toJSON: { virtuals: true },
	timestamps: true
})
export class Media extends Document {
	@Prop()
	mimetype: string;

	@Prop({ required: true })
	path: string;
}

export const MediaSchema = SchemaFactory.createForClass(Media);
