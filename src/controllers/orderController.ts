import { NextFunction } from "express";
import orderModel from "../models/orderModel";
import type { CustomRequest, CustomResponse } from "../types/express";
import { ObjectId } from "mongodb";
import { OrderInput } from "../types/order";
import stripe from "../lib/stripe";

const orderController = {
  getAllOrders: async (
    req: CustomRequest,
    res: CustomResponse,
    next: NextFunction
  ) => {
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
  getOrderById: async (
    req: CustomRequest,
    res: CustomResponse,
    next: NextFunction
  ) => {
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
      data.userId = new ObjectId("6669d6aae384c5bf46d885cb");
      const order = await orderModel.create(data);
      if (!order) {
        return;
      }
      const guide = await orderModel.findById(order.insertedId.toHexString());
      const priceIDR: any = guide?.package.totalPrice;
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Paket Liburan",
              },
              unit_amount: 3 * 100,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `http://localhost:3000/complete?session_id=${order.insertedId}`,
        cancel_url: `http://localhost:3000/cancel?session_id=${order.insertedId}`,
      });
      res.status(200).json({
        statusCode: 200,
        message: "Order retrieved successfully",
        data: session.url,
      });
    } catch (error) {
      next(error);
    }
  },
  updateStatus: async (
    req: CustomRequest,
    res: CustomResponse,
    next: NextFunction
  ) => {
    try {
      const data = req.body;
      const order = await orderModel.updateStatus(data.id, data.status);
      if (!order) {
        return;
      }
    } catch (error) {
      next(error);
    }
  },
};

export default orderController;
