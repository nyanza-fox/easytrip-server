import orderModel from '../models/orderModel';

import type { NextFunction, Request } from 'express';
import type { CustomResponse } from '../types/response';

const orderController = {
  getAllOrders: async (req: Request, res: CustomResponse, next: NextFunction) => {
    try {
      const { search, page, limit } = req.query;

      const { data, pagination } = await orderModel.findAllWithPagination(
        search?.toString() || '',
        Number(page || 1),
        Number(limit || 10)
      );

      res.status(200).json({
        statusCode: 200,
        message: 'Orders retrieved successfully',
        data,
        pagination,
      });
    } catch (error) {
      next(error);
    }
  },
  getOrderById: async (req: Request, res: CustomResponse, next: NextFunction) => {
    try {
      const { id } = req.params;

      const order = await orderModel.findById(id);

      if (!order) {
        return next({
          statusCode: 404,
          name: 'Not Found',
          message: 'Order not found',
        });
      }

      res.status(200).json({
        statusCode: 200,
        message: 'Order retrieved successfully',
        data: order,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default orderController;
