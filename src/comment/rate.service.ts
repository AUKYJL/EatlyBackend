import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { Rate } from './entities/rate.entity';

@Injectable()
export class RateService {
  constructor(
    @InjectRepository(Rate)
    private readonly rateRepository: Repository<Rate>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  //   async create(userRate: userRate) {
  //     const comment = await this.commentRepository.findOne({
  //       where: {
  //         id: userRate.commentId,
  //       },
  //     });
  //     if (!comment) throw new NotFoundException('This comment not found');

  //     const user = await this.userRepository.findOne({
  //       where: {
  //         id: userRate.userId,
  //       },
  //     });
  //     if (!user) throw new NotFoundException('This user not found');

  //     return await this.rateRepository.save({
  //       rate: userRate.rate,
  //       comment,
  //       user,
  //     });
  //   }

  //   async update(userRate: userRate) {
  //     const currentRate = await this.rateRepository.findOne({
  //       where: {
  //         comment: {
  //           id: userRate.commentId,
  //         },
  //         user: {
  //           id: userRate.userId,
  //         },
  //       },
  //     });
  //     currentRate.rate = userRate.rate;
  //     return await this.rateRepository.update(currentRate.id, currentRate);
  //   }

  //   async setNewRate(userRate: userRate) {
  //     const rate = await this.rateRepository.findOne({
  //       where: {
  //         comment: {
  //           id: userRate.commentId,
  //         },
  //         user: {
  //           id: userRate.userId,
  //         },
  //       },
  //     });
  //     if (rate) {
  //       return this.update(userRate);
  //     } else {
  //       return this.create(userRate);
  //     }
  //   }

  //   async getAllRates(commentId: number) {
  //     return await this.rateRepository.find({
  //       where: { comment: { id: commentId } },
  //     });
  //   }
}
