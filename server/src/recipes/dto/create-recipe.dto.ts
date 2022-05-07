import { IsNotEmpty, ArrayNotEmpty, IsString, IsArray, IsMongoId, IsOptional } from 'class-validator';

export class CreateRecipeDto {
	@IsNotEmpty({
		message: "Անվանումը պարտադիր է լրացման համար"
	})
	title: string;

	@IsString()
	slug: string;

	@IsArray()
	@ArrayNotEmpty({
		message: "Կատեգորիան պարտադիր է լրացման համար"
	})
	categories: string[];

	@IsOptional()
	@IsMongoId()
	thumbnail: string;

	@IsString()
	status: string;

	@IsOptional()
	@IsArray()
	ingredients: Array<any>;

	@IsOptional()
	@IsString()
	instructions: string;
}
