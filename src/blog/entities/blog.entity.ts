import { Article } from 'src/article/entities/article.entity';
import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Blog {
  @PrimaryGeneratedColumn({ name: 'blog_id' })
  id: number;
  @OneToMany(() => Article, (article) => article.blog)
  articles: Article[];
}
