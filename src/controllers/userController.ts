import userModel from '../models/userModel';

import type { NextFunction, Request } from 'express';
import type { CustomResponse } from '../types/response';

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
};

export default userController;
