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
      urlToImg: createRestaurantDto.urlToImg,
      time: createRestaurantDto.time,
      rating: 0,
    });
    return restaurant;
  }

  async findAllOwn(userId: number) {
    const restaurants = await this.restaurantRepository.find({
      where: {
        owner: { id: userId },
      },
      relations: { bookmarkedUsers: true, owner: true },
    });
    return restaurants;
  }

  async findAllOwnWithPagination(page: number, limit: number, userId: number) {
    const restaurants = await this.restaurantRepository.find({
      where: {
        owner: { id: userId },
      },
      relations: { bookmarkedUsers: true, owner: true },
      take: limit,
      skip: (page - 1) * limit,
    });
    return restaurants;
  }

  async findAllBookmarkedRestaurants(userId: number) {
    const restaurants = await this.restaurantRepository.find({
      where: {
        bookmarkedUsers: { id: userId },
      },
      relations: { bookmarkedUsers: true, owner: true },
    });
    return restaurants;
  }

  async findAllBookmarkedRestaurantsWithPagination(
    page: number,
    limit: number,
    userId: number,
  ) {
    const restaurants = await this.restaurantRepository.find({
      where: {
        bookmarkedUsers: { id: userId },
      },
      relations: { bookmarkedUsers: true, owner: true },
      take: limit,
      skip: (page - 1) * limit,
    });
    return restaurants;
  }

  async changeBookMark(userId: number, restaurantId: number) {
    let changed = false;
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
      relations: { bookmarkedUsers: true, owner: true },
    });
    if (!restaurant) throw new NotFoundException('This restaurant not found');

    if (!restaurant.bookmarkedUsers) restaurant.bookmarkedUsers = [];

    for (let i = 0; i < restaurant.bookmarkedUsers.length; i++) {
      const user = restaurant.bookmarkedUsers[i];
      if (userId == user.id) {
        restaurant.bookmarkedUsers.splice(i, 1);
        changed = true;
        break;
      }
    }
    if (!changed) {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      restaurant.bookmarkedUsers.push(user);
    }
    return await this.restaurantRepository.save(restaurant);
  }

  async findAll() {
    const restaurants = await this.restaurantRepository.find({
      relations: { bookmarkedUsers: true, owner: true },
    });
    const res = this.mapRestaurantsToWithBookmarkedUsersId(restaurants);
    return res;
  }

  async findOne(id: number) {
    const restaurant = await this.restaurantRepository.findOne({
      where: {
        id,
      },
      relations: {
        dishes: true,
        bookmarkedUsers: true,
        // comments: true,
        owner: true,
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

  private mapRestaurantsToWithBookmarkedUsersId(restaurants: Restaurant[]) {
    return restaurants.map((r) => ({
      owner: r.owner,
      id: r.id,
      title: r.title,
      desc: r.desc,
      tag: r.tag,
      rating: r.rating,
      time: r.time,
      urlToImg: r.urlToImg,
      adress: r.adress,
      bookmarkedUsers: r.bookmarkedUsers.map((u) => ({
        id: u.id,
      })),
    }));
  }
  async findAllWithPagination(page: number, limit: number) {
    const restaurants = await this.restaurantRepository.find({
      take: limit,
      skip: (page - 1) * limit,
      relations: { bookmarkedUsers: true, owner: true },
    });
    const res = this.mapRestaurantsToWithBookmarkedUsersId(restaurants);
    return res;
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
