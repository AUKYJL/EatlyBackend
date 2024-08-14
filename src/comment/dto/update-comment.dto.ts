import { Optional } from '@nestjs/common';
import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';
import { CreateCommentDto } from './create-comment.dto';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  @IsNotEmpty()
  @Optional()
  title?: string;
  @IsNotEmpty()
  @Optional()
  message?: string;

  @IsNotEmpty()
  @Optional()
  @IsInt()
  @Min(1)
  @Max(5)
  rate?: number;
}
