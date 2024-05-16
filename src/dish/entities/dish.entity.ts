import { Comment } from 'src/comment/entities/comment.entity';
import { Purchase } from 'src/purchase/entities/purchase.entity';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DishCategories, DishGroups, DishTags } from '../types/dish.interface';

@Entity()
export class Dish {
  @PrimaryGeneratedColumn({ name: 'dish_id' })
  id: number;

  @Column()
  title: string;

  @Column('decimal', { scale: 2 })
  price: number;

  @Column()
  rating: number;

  @Column()
  timeToCook: string;

  @Column()
  isPopular: boolean;

  @Column()
  tag: DishTags;

  @Column()
  urlToImg: string;

  @Column()
  dishGroup: DishGroups;

  @Column()
  dishCategory: DishCategories;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.dishes, {
    onDelete: 'CASCADE',
  })
  restaurant: Restaurant;

  @ManyToMany(() => User, (user) => user.likedFoods, {
    onDelete: 'CASCADE',
  })
  usersLikedFood: User[];

  @ManyToMany(() => User, (user) => user.foodsInCart, {
    onDelete: 'CASCADE',
  })
  userAddedInCart: User[];

  @ManyToMany(() => Purchase, (purchase) => purchase.dish, {
    onDelete: 'CASCADE',
  })
  purchase: Purchase[];

  @OneToMany(() => Comment, (comment) => comment.dish, {
    onDelete: 'CASCADE',
  })
  comments: Comment[];
}
