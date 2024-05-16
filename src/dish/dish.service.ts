import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { User } from 'src/user/entities/user.entity';
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
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
        restaurant: {
          id: restaurant.id,
        },
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
  private mapDishesToWithUserLikedFood(dishes: Dish[]) {
    return dishes.map((d) => ({
      id: d.id,
      title: d.title,
      price: d.price,
      rating: d.rating,
      timeToCook: d.timeToCook,
      isPopular: d.isPopular,
      tag: d.tag,
      urlToImg: d.urlToImg,
      dishGroup: d.dishGroup,
      dishCategory: d.dishGroup,
      restaurantId: d.restaurant.id,
      usersLikedFood: d.usersLikedFood.map((u) => ({
        id: u.id,
      })),
    }));
  }

  async findAll() {
    const dishes = await this.dishRepository.find({
      relations: { restaurant: true, usersLikedFood: true },
    });

    return this.mapDishesToWithUserLikedFood(dishes);
  }

  async changeLiked(dishId: number, userId: number) {
    let changed = false;
    const dish = await this.dishRepository.findOne({
      where: { id: dishId },
      relations: { usersLikedFood: true },
    });
    if (!dish) throw new NotFoundException('This dish not found');

    if (!dish.usersLikedFood) dish.usersLikedFood = [];

    for (let i = 0; i < dish.usersLikedFood.length; i++) {
      const user = dish.usersLikedFood[i];
      if (user.id == userId) {
        dish.usersLikedFood.splice(i, 1);
        changed = true;
        break;
      }
    }
    if (!changed) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      dish.usersLikedFood.push(user);
    }
    return await this.dishRepository.save(dish);
  }

  async findAllRestaurantDishes(restaurantId: number) {
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
      relations: {
        usersLikedFood: true,
        userAddedInCart: true,
        purchase: true,
        comments: true,
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

  async findAllWithPagination(page: number, limit: number) {
    const dishes = await this.dishRepository.find({
      take: limit,
      skip: (page - 1) * limit,
      relations: { usersLikedFood: true, restaurant: true },
    });
    return this.mapDishesToWithUserLikedFood(dishes);
  }

  async findAllRestaurantDishesWithPagination(
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
