import { db } from '../lib/mongodb';

import type { Order } from '../types/order';

type OrderModel = {
  findAll: () => Promise<Order[]>;
};

const orderModel: OrderModel = {
  findAll: async () => {
    const orders = (await db.collection('orders').find().toArray()) as Order[];
    return orders;
  },
};

export default orderModel;
