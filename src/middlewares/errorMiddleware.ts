import { NextFunction } from 'express';

import type { CustomError, CustomRequest, CustomResponse } from '../types/express';

const errorMiddleware = (
  err: CustomError,
  _req: CustomRequest,
  res: CustomResponse,
  _next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let error = err.name || 'Internal Server Error';
  let message = err.message || 'Something went wrong';

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    error = 'Unauthorized';
    message = 'Invalid token';
  }

  res.status(statusCode).json({ statusCode, error, message });
};

export default errorMiddleware;
