import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CartProductService } from './cart-product.service';
import { CreateCartProductDto } from './dto/create-cart-product.dto';
import { UpdateCartProductDto } from './dto/update-cart-product.dto';

@Controller('cart-product')
export class CartProductController {
  constructor(private readonly cartProductService: CartProductService) {}

  @Post()
  create(@Body() createCartProductDto: CreateCartProductDto) {
    // return this.cartProductService.create(createCartProductDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAllOwn(@Req() req) {
    return this.cartProductService.findAllOwn(+req.user.id);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  changeCount(
    @Query('dishId') dishId: string,
    @Body() updateCartProductDto: UpdateCartProductDto,
    @Req() req,
  ) {
    return this.cartProductService.changeCount(
      +dishId,
      +req.user.id,
      updateCartProductDto,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartProductService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCartProductDto: UpdateCartProductDto,
  ) {
    return this.cartProductService.update(+id, updateCartProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartProductService.remove(+id);
  }
}
