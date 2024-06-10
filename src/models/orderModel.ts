import { db } from '../lib/mongodb';

const orderModel = {
  findAll: async () => {
    const orders = await db.collection('orders').find().toArray();
    return orders;
  },
};

export default orderModel;
