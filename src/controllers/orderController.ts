import { NextFunction } from 'express';

import orderModel from '../models/orderModel';

import type { CustomRequest, CustomResponse } from '../types/express';

const orderController = {
  getAllOrders: async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    try {
      const { search, page, limit } = req.query;

      const { data, pagination } = await orderModel.findAllWithPagination(
        search?.toString() || "",
        Number(page || 1),
        Number(limit || 10)
      );

      res.status(200).json({
        statusCode: 200,
        message: "Orders retrieved successfully",
        data,
        pagination,
      });
    } catch (error) {
      next(error);
    }
  },
  getOrderById: async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    try {
      const { id } = req.params;

      const order = await orderModel.findById(id);

      if (!order) {
        return next({
          statusCode: 404,
          name: "Not Found",
          message: "Order not found",
        });
      }

      res.status(200).json({
        statusCode: 200,
        message: "Order retrieved successfully",
        data: order,
      });
    } catch (error) {
      next(error);
    }
  },
  getOrderByUserId: async (
    req: CustomRequest,
    res: CustomResponse,
    next: NextFunction
  ) => {
    try {
      res.status(200).json({
        statusCode: 200,
        message: "Order retrieved successfully",
        // data: order,
      });
    } catch (error) {
      next(error);
    }
  },
  createOrderAndPayment: async (
    req: CustomRequest,
    res: CustomResponse,
    next: NextFunction
  ) => {
    try {
      const data: OrderInput = req.body;
      const id = req.loginInfo?.userId as ObjectId;
      const payload = {
        userId: new ObjectId(id),
        destinationId: data.destinationId,
        totalPrice: data.totalPrice,
        status: data.status,
        itinerary: data.itinerary,
        transportations: data.transportations,
        accommodations: data.accommodations,
        guides: data.guides,
      };
      const order = await orderModel.createOrder(payload);
      res.status(200).json({
        statusCode: 200,
        message: "Order retrieved successfully",
        // data: order,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default orderController;
