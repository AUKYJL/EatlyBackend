import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dish } from 'src/dish/entities/dish.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateCartProductDto } from './dto/create-cart-product.dto';
import { UpdateCartProductDto } from './dto/update-cart-product.dto';
import { CartProduct } from './entities/cart-product.entity';

@Injectable()
export class CartProductService {
  constructor(
    @InjectRepository(CartProduct)
    private readonly cartProductRepository: Repository<CartProduct>,
    @InjectRepository(Dish)
    private readonly dishRepository: Repository<Dish>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userId: number, createCartProductDto: CreateCartProductDto) {
    const dish = await this.dishRepository.findOne({
      where: {
        id: createCartProductDto.dishId,
      },
    });
    if (!dish) throw new NotFoundException('This dish not found');

    const owner = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    return await this.cartProductRepository.save({
      count: 0,
      customer: owner,
      dish: dish,
    });
  }

  async findAllOwn(userId: number) {
    return await this.cartProductRepository.find({
      where: { customer: { id: userId } },
      relations: {
        dish: true,
        customer: true,
      },
    });
  }
  async changeCount(
    dishId: number,
    userId: number,
    updateCart: UpdateCartProductDto,
  ) {
    let product = await this.cartProductRepository.findOne({
      where: { dish: { id: dishId }, customer: { id: userId } },
      relations: { dish: true, customer: true },
    });
    let newCount = updateCart.count;
    if (newCount <= 0) {
		if(product) this.remove(product.id);
    }

    if (!product) {
      product = await this.create(userId, { dishId });
    }
    await this.cartProductRepository.update(product.id, updateCart);
    product.count = updateCart.count;
    return product;
  }

  findOne(id: number) {
    return `This action returns a #${id} cartProduct`;
  }

  update(id: number, updateCartProductDto: UpdateCartProductDto) {
    return `This action updates a #${id} cartProduct`;
  }

  remove(id: number) {
    const product = this.cartProductRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('This product not found');
    return this.cartProductRepository.delete(id);
  }
}
