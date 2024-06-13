import { Response } from 'express';

export type Pagination = {
  totalData: number;
  currentPage: number;
  totalPage: number;
  nextPage: number | null;
  prevPage: number | null;
};

export type BaseResponse<T> = {
  statusCode: number;
  message?: string;
  data?: T;
  pagination?: Pagination;
  error?: string;
};

export interface CustomResponse<T = unknown> extends Response {
  json(body: BaseResponse<T>): this;
}
