import {
  DeleteResult,
  Document,
  Filter,
  InsertManyResult,
  InsertOneResult,
  ObjectId,
  UpdateResult,
} from 'mongodb';

import { hashStr } from '../lib/bcrypt';
import { db } from '../lib/mongodb';
import redis from '../lib/redis';

import type { BaseResponse } from '../types/response';
import type { Profile, User, UserInput } from '../types/user';

type UserModel = {
  findAll: () => Promise<User[]>;
  findAllWithPagination: (
    search?: string,
    page?: number,
    limit?: number
  ) => Promise<Pick<BaseResponse<User[]>, 'data' | 'pagination'>>;
  findById: (id: string) => Promise<(User & { password: string }) | null>;
  findByEmail: (email: string) => Promise<(User & { password: string }) | null>;
  create: (payload: UserInput) => Promise<InsertOneResult>;
  createMany: (payload: UserInput[]) => Promise<InsertManyResult>;
  updateProfile: (id: string, profile: Profile) => Promise<UpdateResult>;
  deleteMany: (filter?: Filter<Document>) => Promise<DeleteResult>;
};

const userModel: UserModel = {
  findAll: async () => {
    const usersCache = await redis.get('users');

    if (usersCache) {
      return JSON.parse(usersCache) as User[];
    }

    const users = (await db
      .collection('users')
      .aggregate([
        {
          $project: {
            password: 0,
          },
        },
      ])
      .toArray()) as User[];

    await redis.set('users', JSON.stringify(users));

    return users;
  },
  findAllWithPagination: async (search: string = '', page: number = 1, limit: number = 10) => {
    if (!search) {
      const usersWithPaginationCache = await redis.get(`users:${page}:${limit}`);

      if (usersWithPaginationCache) {
        return JSON.parse(usersWithPaginationCache) as Pick<
          BaseResponse<User[]>,
          'data' | 'pagination'
        >;
      }
    }

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
        {
          $project: {
            password: 0,
          },
        },
      ])
      .toArray()) as User[];

    const count = await db.collection('users').countDocuments({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ],
    });

    const result = {
      data: users,
      pagination: {
        totalData: count,
        currentPage: page,
        totalPage: Math.ceil(count / limit),
        nextPage: page < Math.ceil(count / limit) ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
      },
    };

    if (!search) {
      await redis.set(`users:${page}:${limit}`, JSON.stringify(result));
    }

    return result;
  },

  findById: async (id: string) => {
    const user = (await db
      .collection('users')
      .findOne({ _id: ObjectId.createFromHexString(id) })) as
      | (User & {
          password: string;
        })
      | null;

    return user;
  },
  findByEmail: async (email: string) => {
    const user = (await db.collection('users').findOne({ email: email })) as
      | (User & {
          password: string;
        })
      | null;

    return user;
  },
  create: async (payload: UserInput) => {
    const result = await db.collection('users').insertOne({
      ...payload,
      password: await hashStr(payload.password),
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const caches = await redis.keys('users*');

    if (!!caches.length) {
      await redis.del(caches);
    }

    return result;
  },
  createMany: async (payload: UserInput[]) => {
    const result = await db.collection('users').insertMany(
      await Promise.all(
        payload.map(async (user) => ({
          ...user,
          password: await hashStr(user.password),
          createdAt: new Date(),
          updatedAt: new Date(),
        }))
      )
    );

    const caches = await redis.keys('users*');

    if (!!caches.length) {
      await redis.del(caches);
    }

    return result;
  },
  updateProfile: async (id: string, profile: Profile) => {
    const result = await db
      .collection('users')
      .updateOne({ _id: ObjectId.createFromHexString(id) }, { $set: { profile } });

    const caches = await redis.keys('users*');

    if (!!caches.length) {
      await redis.del(caches);
    }

    return result;
  },
  deleteMany: async (filter: Filter<Document> = {}) => {
    const result = await db.collection('users').deleteMany(filter);

    const caches = await redis.keys('users*');

    if (!!caches.length) {
      await redis.del(caches);
    }

    return result;
  },
};

export default userModel;
