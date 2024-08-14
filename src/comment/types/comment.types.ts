import { IUser } from 'src/types/types';

export enum commentType {
  dish = 'dish',
  restaurant = 'restaurant',
}
export interface userRate {
  userId: number;
  commentId: number;
  rate: number;
}

export interface IComment {
  id: number;
  title: string;
  message: string;
  type: commentType;
  rate: number;
  updatedDate: Date;
  author: IUser;
}
