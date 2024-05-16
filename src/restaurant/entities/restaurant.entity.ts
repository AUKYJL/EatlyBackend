import { Comment } from 'src/comment/entities/comment.entity';
import { Dish } from 'src/dish/entities/dish.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RestaurantTags } from '../types/restaurant.types';

@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn({ name: 'restaurant_id' })
  id: number;

  @Column()
  title: string;

  @Column()
  desc: string;

  @Column({ nullable: true })
  tag: RestaurantTags;

  @Column()
  rating: number;

  @Column()
  time: string;

  @Column()
  urlToImg: string;

  @ManyToOne(() => User, (user) => user.ownRestaurants)
  owner: User;

  @OneToMany(() => Dish, (dish) => dish.restaurant, { onDelete: 'CASCADE' })
  dishes: Dish[];

  @Column()
  adress: string;

  @ManyToMany(() => User, (user) => user.bookmarkedRestaurants, {
    onDelete: 'CASCADE',
  })
  bookmarkedUsers: User[];

  @OneToMany(() => Comment, (comment) => comment.restaurant, {
    onDelete: 'CASCADE',
  })
  comments: Comment[];
}
