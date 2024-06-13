import { ObjectId } from 'mongodb';

import userModel from '../models/userModel';

import type { NextFunction, Request } from 'express';
import type { CustomResponse } from '../types/response';
import type { ProfileInput } from '../types/user';

interface CustomRequest extends Request {
  loginInfo?: {
    userId: ObjectId;
    email: string;
    role: string;
  };
}

const userController = {
  getAllUsers: async (req: Request, res: CustomResponse, next: NextFunction) => {
    try {
      const { search, page, limit } = req.query;

      const { data, pagination } = await userModel.findAllWithPagination(
        search?.toString() || '',
        Number(page || 1),
        Number(limit || 10)
      );

      res.status(200).json({
        statusCode: 200,
        message: 'Users retrieved successfully',
        data,
        pagination,
      });
    } catch (error) {
      next(error);
    }
  },
  getProfile: async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    try {
      const email = req.loginInfo?.email as string;
      const users = await userModel.getUserByEmail(email);

      res.status(200).json({
        statusCode: 200,
        message: 'Users retrieved successfully',
        data: users,
      });
    } catch (error) {
      next(error);
    }
  },
  updateProfile: async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    try {
      const email = req.loginInfo?.email as string;
      const body: ProfileInput = req.body;
      const users = await userModel.updateProfile(body, email);

      res.status(200).json({
        statusCode: 200,
        message: 'Users retrieved successfully',
        data: users,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default userController;
