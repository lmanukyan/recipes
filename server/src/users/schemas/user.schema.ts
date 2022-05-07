import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RolesEnum } from '../enums/roles.enum';

@Schema({
	toJSON: { virtuals: true },
	timestamps: true
})
export class User extends Document {
	@Prop({ required: true })
	name: string;

	@Prop({ required: true, index: true, unique: true })
	email: string;

	@Prop({ required: true })
	password: string;

	@Prop({ enum: RolesEnum, default: RolesEnum.editor })
	role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
