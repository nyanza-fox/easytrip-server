import { Response } from 'express';

export type BaseResponse<T> = {
  statusCode: number;
  message?: string;
  data?: T;
  pagination?: {
    totalData: number;
    currentPage: number;
    totalPage: number;
    nextPage: number | null;
    prevPage: number | null;
  };
  error?: string;
};

export interface CustomResponse<T = unknown> extends Response {
  json(body: BaseResponse<T>): this;
}
