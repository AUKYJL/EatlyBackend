import { Dish } from 'src/dish/entities/dish.entity';
import { User } from 'src/user/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Purchase {
  @PrimaryGeneratedColumn({ name: 'purchase_id' })
  id: number;

  @ManyToMany(() => Dish, (dish) => dish.purchase)
  @JoinTable()
  dish: Dish[];

  @CreateDateColumn()
  Date: Date;

  @ManyToOne(() => User, (user) => user.purchases)
  customer: User;
}
