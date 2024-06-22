import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dish } from 'src/dish/entities/dish.entity';
import { User } from 'src/user/entities/user.entity';
import { CartProductController } from './cart-product.controller';
import { CartProductService } from './cart-product.service';
import { CartProduct } from './entities/cart-product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CartProduct, Dish, User])],
  controllers: [CartProductController],
  providers: [CartProductService],
})
export class CartProductModule {}
