import { Blog } from 'src/blog/entities/blog.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Article {
  @PrimaryGeneratedColumn({ name: 'aricle_id' })
  id: number;

  @Column()
  title: string;

  @ManyToOne(() => User, (user) => user.articles)
  author: User;

  @CreateDateColumn()
  createDate: Date;

  @Column()
  desc: string;

  @ManyToOne(() => Blog, (blog) => blog.articles)
  blog: Blog;
}
