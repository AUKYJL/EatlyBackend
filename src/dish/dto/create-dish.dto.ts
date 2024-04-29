import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { DishCategories, DishGroups, DishTags } from '../types/dish.interface';

export class CreateDishDto {
  @IsNotEmpty()
  @IsNumber()
  restaurantId: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  price: number;

  timeToCook?: string;

  urlToImg: string;

  tag?: DishTags;

  dishGroup?: DishGroups;

  dishCategory?: DishCategories;
}
