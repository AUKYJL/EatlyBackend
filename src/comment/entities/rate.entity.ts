import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Rate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rate: number;

  //   @ManyToOne(() => Comment, (comment) => comment.userRates)
  //   @JoinTable()
  //   comment: Comment;

  //   //who rated
  //   @ManyToOne(() => User, (user) => user.userCommentsRates)
  //   @JoinTable()
  //   user: User;
}
