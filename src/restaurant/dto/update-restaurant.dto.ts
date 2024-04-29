import { PartialType } from '@nestjs/mapped-types';
import { RestaurantTags } from '../types/restaurant.types';
import { CreateRestaurantDto } from './create-restaurant.dto';

export class UpdateRestaurantDto extends PartialType(CreateRestaurantDto) {
  title: string;

  desc?: string;

  tag?: RestaurantTags;

  adress?: string;
}
