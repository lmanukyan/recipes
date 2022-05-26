import { Controller, Req, Get, Body, Param, Post, Put, Delete, UseGuards, Query } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('recipes')
export class RecipesController {
    constructor(
        private readonly recipesService: RecipesService
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post('create')
    create(@Body() recipeDto: CreateRecipeDto, @Req() req: any) {
        return this.recipesService.create(recipeDto, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() recipeDto: CreateRecipeDto, @Req() req) {
        return this.recipesService.update(id, recipeDto, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    delete(@Param('id') id: string, @Req() req) {
        return this.recipesService.delete(id, req.user);
    }

    @Get(':id')
    getById(@Param('id') id: string) {
        return this.recipesService.getById(id);
    }

    @Get('/u/:slug')
    getByslug(@Param('slug') slug: string) {
        return this.recipesService.getBySlug(slug);
    }

    @Get()
    getAll(@Query() params) {
        return this.recipesService.getAll(params);
    }

    @Get('transform/start')
    transform() {
        return this.recipesService.transform();
    }

 

    
}
