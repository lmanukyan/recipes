import { Controller, Get, Body, Post, Put, Delete, Param, UseGuards, Query, Req } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { RolesEnum } from '../users/enums/roles.enum';

@Controller('categories')
export class CategoriesController {

    constructor(
        private readonly categoriesService: CategoriesService
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post('create')
    create(@Body() categoryDto: CreateCategoryDto, @Req() req: any) {
        return this.categoriesService.create(categoryDto, req.user);
    }

    @UseGuards(RolesGuard)
    @Roles([RolesEnum.administrator, RolesEnum.moderator])
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.categoriesService.delete(id);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() categoryDto: CreateCategoryDto, @Req() req: any) {
        return this.categoriesService.update(id, categoryDto, req.user);
    }

    @Get(':id')
    getById(@Param('id') id: string) {
        return this.categoriesService.getById(id);
    }

    @Get()
    getAll(@Query() params) {
        return this.categoriesService.getAll(params);
    }

}
