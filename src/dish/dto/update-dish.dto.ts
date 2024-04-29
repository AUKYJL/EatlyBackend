import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';
import { DishCategories, DishGroups, DishTags } from '../types/dish.interface';
import { CreateDishDto } from './create-dish.dto';

export class UpdateDishDto extends PartialType(CreateDishDto) {
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
