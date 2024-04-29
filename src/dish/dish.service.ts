import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { Repository } from 'typeorm';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { Dish } from './entities/dish.entity';

@Injectable()
export class DishService {
  constructor(
    @InjectRepository(Dish) private readonly dishRepository: Repository<Dish>,
    @InjectRepository(Restaurant)
    private readonly restaurauntRepository: Repository<Restaurant>,
  ) {}

  async create(createDishDto: CreateDishDto, userId: number) {
    const restaurant = await this.restaurauntRepository.findOne({
      where: {
        id: createDishDto.restaurantId,
        owner: { id: userId },
      },
    });

    if (!restaurant)
      throw new NotFoundException(
        'This restauraunt doesnt found or its not ur own',
      );
    const isExists = await this.dishRepository.findOne({
      where: {
        title: createDishDto.title,
      },
    });
    if (isExists)
      throw new BadRequestException('This name of food already exists');
    const dish = await this.dishRepository.save({
      title: createDishDto.title,
      price: createDishDto.price,
      timeToCook: createDishDto.timeToCook,
      tag: createDishDto.tag,
      urlToImg: createDishDto.urlToImg,
      dishGroup: createDishDto.dishGroup,
      dishCategory: createDishDto.dishCategory,
      isPopular: false,
      rating: 0,
      restaurant: restaurant,
    });
    return dish;
  }

  async findAll(restaurantId: number) {
    const dishes = await this.dishRepository.find({
      where: {
        restaurant: { id: restaurantId },
      },
    });
    return dishes;
  }

  async findOne(id: number) {
    const dish = await this.dishRepository.findOne({
      where: {
        id,
      },
    });
    return dish;
  }

  async update(id: number, updateDishDto: UpdateDishDto, userId: number) {
    const restaurant = await this.restaurauntRepository.findOne({
      where: {
        owner: { id: userId },
        dishes: { id },
      },
    });
    if (!restaurant) throw new NotFoundException('This dish wasnt found');
    return await this.dishRepository.update(id, updateDishDto);
  }

  async remove(id: number, userId: number) {
    const restaurant = await this.restaurauntRepository.findOne({
      where: {
        owner: { id: userId },
        dishes: { id },
      },
    });
    if (!restaurant) throw new NotFoundException('This dish wasnt found');
    return this.dishRepository.delete(id);
  }

  async findAllWithPagination(
    restaurantId: number,
    page: number,
    limit: number,
  ) {
    const dishes = await this.dishRepository.find({
      where: {
        restaurant: { id: restaurantId },
      },
      take: limit,
      skip: (page - 1) * limit,
    });
    return dishes;
  }

  async findPopularDish(restaurantId: number) {
    return await this.dishRepository.find({
      where: {
        restaurant: {
          id: restaurantId,
        },
        isPopular: true,
      },
    });
  }
}
