import { Controller, Get, Body, Post, Put, Delete, Param, UseGuards, Query, Req } from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { RolesEnum } from '../users/enums/roles.enum';

@Controller('ingredients')
export class IngredientsController {

    constructor(
        private readonly ingredientsService: IngredientsService
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post('create')
    create(@Body() ingredientDto: CreateIngredientDto, @Req() req: any) {
        return this.ingredientsService.create(ingredientDto, req.user);
    }

    @UseGuards(RolesGuard)
    @Roles([RolesEnum.administrator, RolesEnum.moderator])
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.ingredientsService.delete(id);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() ingredientDto: CreateIngredientDto, @Req() req: any) {
        return this.ingredientsService.update(id, ingredientDto, req.user);
    }
    
    @Get(':id')
    getById(@Param('id') id: string) {
        return this.ingredientsService.getById(id);
    }

    @Get()
    getAll(@Query() params) {
        return this.ingredientsService.getAll(params);
    }

    @Post('/labels')
    getLabels(@Body() ids) {
        return this.ingredientsService.getLabels(ids);
    }
}
