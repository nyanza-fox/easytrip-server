import orderModel from '../models/orderModel';

import type { NextFunction, Request } from 'express';
import type { CustomResponse } from '../types/response';

const orderController = {
  getAllOrders: async (_req: Request, res: CustomResponse, next: NextFunction) => {
    try {
      const orders = await orderModel.findAll();

      res.status(200).json({
        statusCode: 200,
        message: 'Orders retrieved successfully',
        data: orders,
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
