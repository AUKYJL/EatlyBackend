import { RestaurantTags } from '../types/restaurant.types';

export class CreateRestaurantDto {
  title: string;

  desc?: string;

  tag?: RestaurantTags;

  adress?: string;
}
