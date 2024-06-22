import { Dish } from 'src/dish/entities/dish.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CartProduct {
  @PrimaryGeneratedColumn({ name: 'purchase_id' })
  id: number;

  @Column({ default: 0 })
  count: number;

  @ManyToOne(() => Dish, (dish) => dish.cartProduct)
  dish: Dish;

  @ManyToOne(() => User, (user) => user.cartProduct)
  customer: User;
}
