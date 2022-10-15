import { Controller, Get, Param, Query, Post, Body } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Get()
  getAllCategory() {
    return this.categoryService.getAllCategory()
  }

  @Get('detail')
  getUniquProduct(@Query('id') id: number) {
    return this.categoryService.getUniquProduct(+id)
  }

  @Get(':id/?:page')
  getUniquCategory(@Param('id') id: number, @Param('page') page: number) {
    return this.categoryService.getUniquCategory(+id, +page)
  }

  @Post(':page')
  fuzzyFind(@Param('page') page, @Body('key') key:string) {
    return this.categoryService.fuzzyFind(key, +page)
  }
}
