import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateCategoryDto {
	@IsNotEmpty({
		message: "Անվանումը պարտադիր է լրացման համար"
	})
	title: string;

	@IsOptional()
	@IsString()
	slug: string;

	@IsOptional()
	@IsString()
	description: string;
}
