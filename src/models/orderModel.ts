import { ObjectId } from 'mongodb';

import { db } from '../lib/mongodb';

import type { Order } from '../types/order';
import type { BaseResponse } from '../types/response';

type OrderModel = {
  findAll: () => Promise<Order[]>;
  findAllWithPagination: (
    search?: string,
    page?: number,
    limit?: number
  ) => Promise<Pick<BaseResponse<Order[]>, 'data' | 'pagination'>>;
  findById: (id: string) => Promise<Order | null>;
};

const orderModel: OrderModel = {
  findAll: async () => {
    const orders = (await db.collection('orders').find().toArray()) as Order[];

    return orders;
  },
  findAllWithPagination: async (_search: string = '', page: number = 1, limit: number = 10) => {
    const orders = (await db
      .collection('orders')
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

    const count = await db.collection('orders').countDocuments();

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
      .collection('orders')
      .findOne({ _id: ObjectId.createFromHexString(id) })) as Order | null;

    return order;
  },
};

export default orderModel;
