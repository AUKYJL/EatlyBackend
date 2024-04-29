import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createRestaurantDto: CreateRestaurantDto, userId: number) {
    const isExists = await this.restaurantRepository.findOne({
      where: {
        title: createRestaurantDto.title,
      },
    });
    if (isExists)
      throw new BadRequestException(
        'This title of restaurant already exists. Please choose another',
      );

    const owner = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    const restaurant = await this.restaurantRepository.save({
      owner: owner,
      title: createRestaurantDto.title,
      adress: createRestaurantDto.adress,
      desc: createRestaurantDto.desc,
      tag: createRestaurantDto.tag,
      //   comments: [],
      //   dishes: [],
      //   likedUsers: [],
      rating: 0,
    });
    return restaurant;
  }

  async findAll() {
    const restaurants = await this.restaurantRepository.find();
    return restaurants;
  }

  async findOne(id: number) {
    const restaurant = await this.restaurantRepository.findOne({
      where: {
        id,
      },
      relations: {
        dishes: true,
      },
    });
    return restaurant;
  }

  async update(
    id: number,
    updateRestaurantDto: UpdateRestaurantDto,
    userId: number,
  ) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    const restaurant = await this.restaurantRepository.findOne({
      where: {
        id,
        owner: user,
      },
    });
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    return await this.restaurantRepository.update(id, updateRestaurantDto);
  }

  async remove(id: number, userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    const isOwnRestaurant = await this.restaurantRepository.findOne({
      where: {
        id,
        owner: user,
      },
    });
    if (!isOwnRestaurant)
      throw new BadRequestException(
        'Its not ur restaurant. U cant delete this',
      );
    const restaurant = this.restaurantRepository.delete(id);
    return restaurant;
  }
}
