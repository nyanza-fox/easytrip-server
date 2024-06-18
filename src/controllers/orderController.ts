import { NextFunction } from 'express';

import orderModel from '../models/orderModel';
import stripe from '../lib/stripe';

import type { CustomRequest, CustomResponse } from '../types/express';

const orderController = {
  getAllOrders: async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
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
  getOrderById: async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
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
  createOrderAndPayment: async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    try {
      const userId = req.user?.id || '';

      const result = await orderModel.create({ ...req.body, userId });
      const order = await orderModel.findById(result.insertedId.toHexString());

      if (!order) {
        return next({
          statusCode: 404,
          name: 'Not Found',
          message: 'Order not found',
        });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'IDR',
              product_data: {
                name: `${
                  order.package.type.charAt(0).toUpperCase() + order.package.type.slice(1)
                } Package`,
                images: [order.package.destination?.images[0] || ''],
              },
              unit_amount: order.package.totalPrice * 100,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${
          process.env.CLIENT_URL
        }/callback/orders/success?sessionId=${order?._id.toHexString()}`,
        cancel_url: `${
          process.env.CLIENT_URL
        }/callback/orders/cancel?sessionId=${order?._id.toHexString()}`,
      });

      res.status(200).json({
        statusCode: 200,
        message: 'Order created successfully',
        data: session.url,
      });
    } catch (error) {
      next(error);
    }
  },
  updateOrderStatus: async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const result = await orderModel.updateStatus(id, status);

      if (!result.modifiedCount) {
        return next({
          statusCode: 404,
          name: 'Not Found',
          message: 'Order not found',
        });
      }

      const order = await orderModel.findById(id);

      res.status(200).json({
        statusCode: 200,
        message: 'Order status updated successfully',
        data: order,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default orderController;
