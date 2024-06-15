import { NextFunction } from 'express';
import { ObjectId } from 'mongodb';

import { verifyToken } from '../lib/jwt';
import userModel from '../models/userModel';

import { CustomRequest, CustomResponse } from '../types/express';

const authMiddleware = {
  authN: async (req: CustomRequest, _res: CustomResponse, next: NextFunction) => {
    try {
      const { authorization } = req.headers;

      if (!authorization || !authorization.startsWith('Bearer')) {
        return next({
          statusCode: 401,
          name: 'Unauthorized',
          message: 'Please login first',
        });
      }

      const token = authorization.split(' ')[1];
      const payload = verifyToken(token) as { id: ObjectId; email: string; role: string };

      const user = await userModel.findByEmail(payload.email);

      if (!user) {
        return next({
          statusCode: 401,
          name: 'Unauthorized',
          message: 'Please login first',
        });
      }

      req.user = {
        id: user._id.toHexString(),
        email: user.email,
        role: user.role,
      };

      next();
    } catch (err) {
      next(err);
    }
  },
  authZ:
    (roles: string[]) => async (req: CustomRequest, _res: CustomResponse, next: NextFunction) => {
      try {
        const role = req.user?.role;

        if (!role) {
          return next({
            statusCode: 401,
            name: 'Unauthorized',
            message: 'Please login first',
          });
        }

        if (!roles.includes(role.toString())) {
          return next({
            statusCode: 403,
            name: 'Forbidden',
            message: 'You are not allowed to access this resource',
          });
        }

        next();
      } catch (err) {
        next(err);
      }
    },
};

export default authMiddleware;
