import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optional-jwt-auth.guard';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { commentType } from './types/comment.types';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  create(@Body() createCommentDto: CreateCommentDto, @Req() req) {
    return this.commentService.create(createCommentDto, req.user.id);
  }

  //   @Patch('rate/:id')
  //   @UseGuards(JwtAuthGuard)
  //   rateComment(
  //     @Param('id') commentId: string,
  //     @Req() req,
  //     @Query('newRate') newRate: string,
  //   ) {
  //     return this.commentService.rateComment(+commentId, +req.user.id, +newRate);
  //   }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  update(
    @Body() updateCommentDto: UpdateCommentDto,
    @Param('id') commentId: string,
    @Req() req,
  ) {
    return this.commentService.updateComment(
      +commentId,
      +req.user.id,
      updateCommentDto,
    );
  }

  @Get()
  getAllComments(
    @Query('type') type: commentType,
    @Query('entityId') entityId: number,
  ) {
    return this.commentService.getAllComments(type, entityId);
  }

  @Get('pagination')
  @UseGuards(OptionalJwtAuthGuard)
  getCommentsWithPagination(
    @Query('type') type: commentType,
    @Query('entityId') entityId: number,
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Req() req,
  ) {
    return this.commentService.getCommentsWithPagination(
      type,
      +entityId,
      +limit,
      +page,
      +req.user.id,
    );
  }

  @Get(':id')
  getCommentById(@Param('id') commentId: string) {
    return this.commentService.getCommentById(+commentId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') commentId: string, @Req() req) {
    return this.commentService.deleteComment(+commentId, +req.user.id);
  }
}
