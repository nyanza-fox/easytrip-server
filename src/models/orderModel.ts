import { InsertOneResult, ObjectId, UpdateResult } from 'mongodb';

import { db } from '../lib/mongodb';
import redis from '../lib/redis';

import type { Order, OrderInput } from '../types/order';
import type { BaseResponse } from '../types/response';

type OrderModel = {
  findAll: () => Promise<Order[]>;
  findAllWithPagination: (
    search?: string,
    page?: number,
    limit?: number
  ) => Promise<Pick<BaseResponse<Order[]>, 'data' | 'pagination'>>;
  findAllByUserId: (userId: string) => Promise<Order[]>;
  findById: (id: string) => Promise<Order | null>;
  create: (payload: OrderInput) => Promise<InsertOneResult>;
  updateStatus: (id: string, status: string) => Promise<UpdateResult>;
};

const orderModel: OrderModel = {
  findAll: async () => {
    const ordersCache = await redis.get('orders');

    if (ordersCache) {
      return JSON.parse(ordersCache) as Order[];
    }

    const orders = (await db
      .collection('orders')
      .aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: '$user',
        },
        {
          $project: {
            'user.password': 0,
          },
        },
      ])
      .toArray()) as Order[];

    await redis.set('orders', JSON.stringify(orders));

    return orders;
  },
  findAllWithPagination: async (search: string = '', page: number = 1, limit: number = 10) => {
    if (!search) {
      const ordersWithPaginationCache = await redis.get(`orders:${page}:${limit}`);

      if (ordersWithPaginationCache) {
        return JSON.parse(ordersWithPaginationCache) as Pick<
          BaseResponse<Order[]>,
          'data' | 'pagination'
        >;
      }
    }

    const orders = (await db
      .collection('orders')
      .aggregate([
        // {
        //   $match: {
        //     userId: { $regex: search, $options: 'i' },
        //   },
        // },
        {
          $sort: { createdAt: -1 },
        },
        {
          $skip: page > 0 ? (page - 1) * limit : 0,
        },
        {
          $limit: limit,
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: '$user',
        },
        {
          $project: {
            'user.password': 0,
          },
        },
      ])
      .toArray()) as Order[];

    const count = await db.collection('orders').countDocuments({
      // userId: { $regex: search, $options: 'i' },
    });

    const result = {
      data: orders,
      pagination: {
        totalData: count,
        currentPage: page,
        totalPage: Math.ceil(count / limit),
        nextPage: page < Math.ceil(count / limit) ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
      },
    };

    if (!search) {
      await redis.set(`orders:${page}:${limit}`, JSON.stringify(result));
    }

    return result;
  },
  findAllByUserId: async (userId: string) => {
    const orders = (await db
      .collection('orders')
      .aggregate([
        {
          $match: {
            userId: ObjectId.createFromHexString(userId),
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: '$user',
        },
        {
          $project: {
            'user.password': 0,
          },
        },
      ])
      .toArray()) as Order[];

    return orders;
  },
  findById: async (id: string) => {
    const order = (await db
      .collection('orders')
      .aggregate([
        {
          $match: {
            _id: ObjectId.createFromHexString(id),
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: '$user',
        },
        {
          $project: {
            'user.password': 0,
          },
        },
      ])
      .next()) as Order | null;

    return order;
  },
  create: async (payload: OrderInput) => {
    const result = await db.collection('orders').insertOne({
      ...payload,
      userId: ObjectId.createFromHexString(payload.userId),
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const caches = await redis.keys('orders*');

    if (!!caches.length) {
      await redis.del(caches);
    }

    return result;
  },
  updateStatus: async (id: string, status: string) => {
    const result = await db
      .collection('orders')
      .updateOne({ _id: ObjectId.createFromHexString(id) }, { $set: { status } });

    const caches = await redis.keys('orders*');

    if (!!caches.length) {
      await redis.del(caches);
    }

    return result;
  },
};

export default orderModel;
