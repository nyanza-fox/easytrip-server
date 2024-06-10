import { NextFunction, Request, Response } from 'express';

const errorMiddleware = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  err.status = err.status || 500;
  err.message = err.message || 'Internal server error';

  if (err.name === 'JsonWebTokenError') {
    err.status = 401;
    err.message = 'Invalid token';
  }

  res.status(err.status).json({ message: err.message });
};

export default errorMiddleware;
