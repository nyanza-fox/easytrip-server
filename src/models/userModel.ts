import { InsertOneResult } from 'mongodb';

import { db } from '../lib/mongodb';

import type { User, UserInput } from '../types/user';
import type { BaseResponse } from '../types/response';

type UserModel = {
  findAll: () => Promise<User[]>;
  findAllWithPagination: (
    search?: string,
    page?: number,
    limit?: number
  ) => Promise<Pick<BaseResponse<User[]>, 'data' | 'pagination'>>;
  register: (payload: UserInput) => Promise<InsertOneResult>;
  getUserByEmail: (email: string) => Promise<User>;
};

const userModel: UserModel = {
  findAll: async () => {
    const users = (await db.collection('users').find().toArray()) as User[];

    return users;
  },
  findAllWithPagination: async (search: string = '', page: number = 1, limit: number = 10) => {
    const users = (await db
      .collection('users')
      .aggregate([
        {
          $match: {
            $or: [
              { name: { $regex: search, $options: 'i' } },
              { email: { $regex: search, $options: 'i' } },
            ],
          },
        },
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
      .toArray()) as User[];

    const count = await db.collection('users').countDocuments({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ],
    });

    return {
      data: users,
      pagination: {
        totalData: count,
        currentPage: page,
        totalPage: Math.ceil(count / limit),
        nextPage: page < Math.ceil(count / limit) ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
      },
    };
  },
  register: async (payload: UserInput) => {
    const users = await db.collection('users').insertOne(payload);

    return users;
  },
  getUserByEmail: async (email: string) => {
    const user = (await db.collection('users').findOne({ email: email })) as User;

    return user;
  },
};

export default userModel;
