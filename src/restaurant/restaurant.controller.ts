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
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { RestaurantService } from './restaurant.service';

@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  create(@Body() createRestaurantDto: CreateRestaurantDto, @Req() req) {
    return this.restaurantService.create(createRestaurantDto, +req.user.id);
  }
  @Get('pagination')
  findAllWithPagination(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    return this.restaurantService.findAllWithPagination(+page, +limit);
  }
  @Get('bookmarked')
  @UseGuards(JwtAuthGuard)
  findAllBookmarkedRestaurants(@Req() req) {
    return this.restaurantService.findAllBookmarkedRestaurants(+req.user.id);
  }

  @Get('bookmarked/pagination')
  @UseGuards(JwtAuthGuard)
  findAllBookmarkedRestaurantsWithPagination(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Req() req,
  ) {
    return this.restaurantService.findAllBookmarkedRestaurantsWithPagination(
      +page,
      +limit,
      +req.user.id,
    );
  }

  @Get('own')
  @UseGuards(JwtAuthGuard)
  findAllOwn(@Req() req) {
    return this.restaurantService.findAllOwn(+req.user.id);
  }

  @Get('own/pagination')
  @UseGuards(JwtAuthGuard)
  findAllOwnWithPagination(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Req() req,
  ) {
    return this.restaurantService.findAllOwnWithPagination(
      +page,
      +limit,
      +req.user.id,
    );
  }

  @Get()
  findAll() {
    return this.restaurantService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantService.findOne(+id);
  }

  @Patch('change-bookmark/:id')
  @UseGuards(JwtAuthGuard)
  changeBookMark(@Param('id') id: string, @Req() req) {
    return this.restaurantService.changeBookMark(+req.user.id, +id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
    @Req() req,
  ) {
    return this.restaurantService.update(
      +id,
      updateRestaurantDto,
      +req.user.id,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Req() req) {
    return this.restaurantService.remove(+id, +req.user.id);
  }
}
