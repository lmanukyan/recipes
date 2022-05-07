import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Type } from 'class-transformer';

import { Category } from '../../categories/schemas/category.schema';
import { Media } from '../../media/schemas/media.schema';
import { User } from '../../users/schemas/user.schema';
import { Ingredient } from '../../ingredients/schemas/ingredient.schema';

@Schema({
	toJSON: { virtuals: true },
	timestamps: true,
})
export class Recipe extends Document {
	@Prop()
	title: string;

	@Prop()
	slug: string;

	@Prop({
    	type: [{ type: Types.ObjectId, ref: Category.name }],
	})
	@Type(() => Category)
	categories: any[];

	@Prop({ type: Types.ObjectId, ref: Media.name })
	@Type(() => Media)
	thumbnail: Media;

	@Prop()
	status: string;

	@Prop()
	ingredients: Array<any>;

	@Prop()
	instructions: string;

	@Prop({ type: Types.ObjectId, ref: User.name })
	@Type(() => User)
	author: Types.ObjectId;
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);

RecipeSchema.virtual('ingredient_ids').get(function(){
	return this.ingredients
		.filter(i => i.type === 'ingredient')
		.map(i => i.value)
})

