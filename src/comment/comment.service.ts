import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dish } from 'src/dish/entities/dish.entity';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { User } from 'src/user/entities/user.entity';
import { Not, Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { Rate } from './entities/rate.entity';
import { RateService } from './rate.service';
import { commentType } from './types/comment.types';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Rate)
    private readonly rateRepository: Repository<Rate>,
    @InjectRepository(Dish)
    private readonly dishRepository: Repository<Dish>,
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    private readonly rateService: RateService,
  ) {}

  async create(createCommentDto: CreateCommentDto, userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) throw new NotFoundException('This user not found');
    let comment: any = {
      author: user,
      updatedDate: new Date(),
      ...createCommentDto,
    };
    let entity;
    switch (createCommentDto.type) {
      case commentType.dish:
        entity = await this.dishRepository.findOne({
          where: { id: createCommentDto.dishId },
        });
        comment = { ...comment, dish: entity as Dish };
        break;

      case commentType.restaurant:
        entity = await this.restaurantRepository.findOne({
          where: { id: createCommentDto.restaurantId },
        });
        comment = { ...comment, restaurant: entity as Restaurant };
        break;
    }
    if (!entity) throw new NotFoundException('This entity not found');

    return await this.commentRepository.save(comment);
  }

  async getCommentById(commentId: number) {
    let relations = {
      author: true,
    };
    const comment = await this.commentRepository.findOne({
      where: {
        id: commentId,
      },
      relations,
    });
    if (!comment) throw new NotFoundException('This comment not found');
    return comment;
  }

  async getAllComments(type: commentType, entityId: number) {
    let comments = null;
    switch (type) {
      case commentType.dish:
        comments = await this.commentRepository.find({
          where: { type, dish: { id: entityId } },
        });
        break;

      case commentType.restaurant:
        comments = await this.commentRepository.find({
          where: { type, restaurant: { id: entityId } },
        });
        break;
    }
    return comments;
  }

  async getCommentsWithPagination(
    type: commentType,
    entityId: number,
    limit: number,
    page: number,
    userId: number,
  ) {
    console.log(userId);
    let comments = null;

    switch (type) {
      case commentType.restaurant:
        // comments = await this.commentRepository.find({
        //   where: {
        //     type,
        //     restaurant: { id: entityId },
        //   },
        //   relations,
        //   take: limit,
        //   skip: (page - 1) * limit,
        // });
        comments = this.getOwnCommentsFirst(userId, type, limit, page, {
          restaurant: { id: entityId },
        });
        break;

      case commentType.dish:
        // comments = await this.commentRepository.find({
        //   where: {
        //     type,
        //     dish: { id: entityId },
        //   },
        //   relations,
        //   take: limit,
        //   skip: (page - 1) * limit,
        // });
        comments = this.getOwnCommentsFirst(userId, type, limit, page, {
          dish: { id: entityId },
        });
        break;
    }
    // if (userId) {
    //   const ownComments = comments.filter((comment: IComment) => {
    //     return +comment.author.id == userId;
    //   });
    //   const otherComments = comments.filter((comment: IComment) => {
    //     return +comment.author.id != userId;
    //   });
    //   const sortedComments = ownComments.concat(otherComments);

    //   return sortedComments;
    // }
    return comments;
  }

  private async getOwnCommentsFirst(
    userId: number,
    type: commentType,
    limit: number,
    page: number,
    entity: { restaurant?: { id: number }; dish?: { id: number } },
  ) {
    const relations = {
      author: true,
    };

    const prioritizedComments = await this.commentRepository.find({
      where: {
        type,
        ...entity,
        author: { id: userId },
      },
      order: { updatedDate: 'DESC' },
      relations,
    });

    const otherComments = await this.commentRepository.find({
      where: {
        type,
        ...entity,
        author: { id: Not(userId) },
      },
      relations,
    });

    const allComments = [...prioritizedComments, ...otherComments];

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedComments = allComments.slice(start, end);

    return paginatedComments;
  }

  async updateComment(
    commentId: number,
    userId: number,
    updateCommentDto: UpdateCommentDto,
  ) {
    const comment = await this.commentRepository.findOne({
      where: {
        id: commentId,
        author: {
          id: userId,
        },
      },
    });
    if (!comment) throw new NotFoundException('This is not your comment');

    const updatedData = { ...updateCommentDto, updatedDate: new Date() };
    return await this.commentRepository.update(commentId, updatedData);
  }

  //   async rateComment(commentId: number, userId: number, newRate: number) {
  //     const comment = await this.commentRepository.findOne({
  //       where: { id: commentId },
  //       relations: {
  //         userRates: true,
  //       },
  //     });
  //     if (!comment) throw new NotFoundException('This comment not found');

  //     await this.rateService.setNewRate({
  //       rate: newRate,
  //       commentId: comment.id,
  //       userId,
  //     });

  //     const rates: Rate[] = await this.rateRepository.find({
  //       where: {
  //         comment: {
  //           id: commentId,
  //         },
  //       },
  //     });

  //     let totalRating = 0;
  //     if (rates.length == 0) totalRating = 0;
  //     else {
  //       totalRating =
  //         rates.reduce((acc, rate) => acc + rate.rate, 0) / rates.length;
  //       totalRating = Math.round(totalRating);
  //     }

  //     comment.rate = totalRating;
  //     comment.userRates = rates;
  //     return this.commentRepository.save(comment);
  //   }

  async deleteComment(commentId: number, userId: number) {
    const comment = await this.commentRepository.findOne({
      where: {
        id: commentId,
        author: {
          id: userId,
        },
      },
    });
    if (!comment) throw new NotFoundException('This is not your comment');
    return await this.commentRepository.delete(commentId);
  }
}
