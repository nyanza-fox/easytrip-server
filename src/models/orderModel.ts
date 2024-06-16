import { InsertOneResult, ObjectId } from "mongodb";

import { db } from "../lib/mongodb";

import type { Order, OrderInput } from "../types/order";
import type { BaseResponse } from "../types/response";

type OrderModel = {
  findAll: () => Promise<Order[]>;
  findAllWithPagination: (
    search?: string,
    page?: number,
    limit?: number
  ) => Promise<Pick<BaseResponse<Order[]>, "data" | "pagination">>;
  findById: (id: string) => Promise<Order | null>;
  createOrder: (payload: OrderInput) => Promise<InsertOneResult>;
};

const orderModel: OrderModel = {
  findAll: async () => {
    const orders = (await db.collection("orders").find().toArray()) as Order[];

    return orders;
  },
  findAllWithPagination: async (
    _search: string = "",
    page: number = 1,
    limit: number = 10
  ) => {
    const orders = (await db
      .collection("orders")
      .aggregate([
        {
          $sort: { createdAt: -1 },
        },
        {
          $skip: page > 0 ? (page - 1) * limit : 0,
        },
        {
          $limit: limit,
        },
      ])
      .toArray()) as Order[];

    const count = await db.collection("orders").countDocuments();

    return {
      data: orders,
      pagination: {
        totalData: count,
        currentPage: page,
        totalPage: Math.ceil(count / limit),
        nextPage: page < Math.ceil(count / limit) ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
      },
    };
  },
  findById: async (id: string) => {
    const order = (await db
      .collection("orders")
      .findOne({ _id: ObjectId.createFromHexString(id) })) as Order | null;

    return order;
  },
  createOrder: async (payload) => {
    const data = {
      userId: payload.userId,
      destinationId: payload.destinationId,
      totalPrice: payload.totalPrice,
      status: payload.status,
      itinerary: payload.itinerary,
      transportations: payload.transportations,
      accommodations: payload.accommodations,
      guides: payload.guides,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const order = await db.collection("orders").insertOne(data);

    return order;
  },
};

export default orderModel;
