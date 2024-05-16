import { Article } from 'src/article/entities/article.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Dish } from 'src/dish/entities/dish.entity';
import { Purchase } from 'src/purchase/entities/purchase.entity';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  password: string;
  @OneToMany(() => Restaurant, (restaurant) => restaurant.owner, {
    onDelete: 'CASCADE',
  })
  ownRestaurants: Restaurant[];

  @ManyToMany(() => Dish, (dish) => dish.usersLikedFood, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  likedFoods: Dish[];

  @ManyToMany(() => Dish, (dish) => dish.userAddedInCart, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  foodsInCart: Dish[];

  @ManyToMany(() => Restaurant, (restaurant) => restaurant.bookmarkedUsers, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  bookmarkedRestaurants: Restaurant[];

  @OneToMany(() => Purchase, (purchase) => purchase.customer)
  purchases: Purchase[];

  @OneToMany(() => Article, (article) => article.author)
  articles: Article[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];
}
