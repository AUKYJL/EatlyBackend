import { IsNotEmpty } from 'class-validator';
import { RestaurantTags } from '../types/restaurant.types';

export class CreateRestaurantDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  desc?: string;
  @IsNotEmpty()
  tag?: RestaurantTags;
  @IsNotEmpty()
  adress?: string;
  @IsNotEmpty()
  urlToImg: string;
  @IsNotEmpty()
  time: string;
}
