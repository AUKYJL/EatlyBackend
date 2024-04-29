import { Dish } from 'src/dish/entities/dish.entity';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn({ name: 'comment_id' })
  id: number;

  @ManyToOne(() => User, (user) => user.comments)
  author: User[];

  @Column()
  title: string;

  @Column()
  message: string;

  @Column()
  rating: number;

  @OneToMany(() => Dish, (dish) => dish.comments)
  dish: Dish;

  @OneToMany(() => Restaurant, (restaurant) => restaurant.comments)
  restaurant: Restaurant;
}
