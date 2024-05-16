import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { DishService } from './dish.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';

@Controller('dishes')
export class DishController {
  constructor(private readonly dishService: DishService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  create(@Body() createDishDto: CreateDishDto, @Req() req) {
    return this.dishService.create(createDishDto, +req.user.id);
  }
  @Get('pagination')
  findAllWithPagination(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    return this.dishService.findAllWithPagination(+page, +limit);
  }
  @Get()
  findAll() {
    return this.dishService.findAll();
  }

  @Get('restaurant/:id')
  findAllRestaurantDishes(@Param('id') restaurantId: string) {
    return this.dishService.findAllRestaurantDishes(+restaurantId);
  }
  @Patch('change-liked/:id')
  @UseGuards(JwtAuthGuard)
  changeLiked(@Param('id') id: string, @Req() req) {
    return this.dishService.changeLiked(+id, +req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dishService.findOne(+id);
  }

  //?page=2&limit=3
  @Get('restaurant/:id/pagination')
  findAllRestaurantDishesWithPagination(
    @Param('id') restaurantId: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    return this.dishService.findAllRestaurantDishesWithPagination(
      +restaurantId,
      +page,
      +limit,
    );
  }

  @Get('restaurant/:id/popular')
  findPopularDish(@Param('id') restaurantId: string) {
    return this.dishService.findPopularDish(+restaurantId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateDishDto: UpdateDishDto,
    @Req() req,
  ) {
    return this.dishService.update(+id, updateDishDto, +req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Req() req) {
    return this.dishService.remove(+id, +req.user.id);
  }
}
