import { db } from '../lib/mongodb';

const userModel = {
  findAll: async () => {
    const users = await db.collection('users').find().toArray();
    return users;
  },
};

export default userModel;
