import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dish } from 'src/dish/entities/dish.entity';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { User } from 'src/user/entities/user.entity';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { Comment } from './entities/comment.entity';
import { Rate } from './entities/rate.entity';
import { RateService } from './rate.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, User, Rate, Dish, Restaurant])],
  controllers: [CommentController],
  providers: [CommentService, RateService],
})
export class CommentModule {}
