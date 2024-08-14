import { IsIn, IsInt, IsNotEmpty, Max, Min } from 'class-validator';
import { commentType } from '../types/comment.types';

export class CreateCommentDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  message: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  rate: number;

  @IsNotEmpty()
  @IsIn([...Object.values(commentType)])
  type: commentType;

  dishId?: number;

  restaurantId?: number;
}
