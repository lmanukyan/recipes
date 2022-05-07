import { IsNotEmpty } from 'class-validator';

export class CreateIngredientDto {
	@IsNotEmpty({
		message: "Անվանումը պարտադիր է լրացման համար"
	})
	title: string;
}
