import { Request, Response } from 'express';

import type { BaseResponse } from './response';

export interface CustomResponse<T = unknown> extends Response {
  json(body: BaseResponse<T>): this;
}

export interface CustomRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export interface CustomError {
  statusCode?: number;
  name?: string;
  message?: string;
}
