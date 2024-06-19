import { NextFunction } from 'express';

import orderModel from '../models/orderModel';
import userModel from '../models/userModel';

import type { CustomRequest, CustomResponse } from '../types/express';

const userController = {
  getAllUsers: async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
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
  getMe: async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    try {
      const userId = req.user?.id || '';

      const user = await userModel.findById(userId);

      res.status(200).json({
        statusCode: 200,
        message: 'User retrieved successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },
  getMyOrders: async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    try {
      const userId = req.user?.id || '';

      const orders = await orderModel.findAllByUserId(userId);

      res.status(200).json({
        statusCode: 200,
        message: 'Orders retrieved successfully',
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  },
  updateMyProfile: async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    try {
      const userId = req.user?.id || '';

      const result = await userModel.updateProfile(userId, req.body);

      if (!result.matchedCount) {
        return next({
          statusCode: 404,
          name: 'Not Found',
          message: 'User not found',
        });
      }

      const user = await userModel.findById(userId);

      res.status(200).json({
        statusCode: 200,
        message: 'User profile updated successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default userController;
