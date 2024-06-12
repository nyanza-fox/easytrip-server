import { db } from '../lib/mongodb';

import type { User } from '../types/user';

type UserModel = {
  findAll: () => Promise<User[]>;
};

const userModel: UserModel = {
  findAll: async () => {
    const users = (await db.collection('users').find().toArray()) as User[];

    return users;
  },
};

export default userModel;
