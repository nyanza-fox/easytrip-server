import { ObjectId } from 'mongodb';

import { db } from '../lib/mongodb';

import type { Order } from '../types/order';

type OrderModel = {
  findAll: () => Promise<Order[]>;
  findById: (id: string) => Promise<Order | null>;
};

const orderModel: OrderModel = {
  findAll: async () => {
    const orders = (await db.collection('orders').find().toArray()) as Order[];

    return orders;
  },
  findById: async (id: string) => {
    const order = (await db
      .collection('orders')
      .findOne({ _id: ObjectId.createFromHexString(id) })) as Order | null;

    return order;
  },
};

export default orderModel;
