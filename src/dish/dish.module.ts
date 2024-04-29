import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { User } from 'src/user/entities/user.entity';
import { DishController } from './dish.controller';
import { DishService } from './dish.service';
import { Dish } from './entities/dish.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dish, Restaurant, User])],
  controllers: [DishController],
  providers: [DishService],
})
export class DishModule {}
