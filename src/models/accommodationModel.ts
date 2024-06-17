import {
  DeleteResult,
  Document,
  Filter,
  InsertManyResult,
  InsertOneResult,
  ObjectId,
  UpdateResult,
} from 'mongodb';

import { db } from '../lib/mongodb';
import redis from '../lib/redis';

import type { Accommodation, AccommodationInput } from '../types/accommodation';
import type { BaseResponse } from '../types/response';

type AccommodationModel = {
  findAll: () => Promise<Accommodation[]>;
  findAllWithPagination: (
    search?: string,
    page?: number,
    limit?: number
  ) => Promise<Pick<BaseResponse<Accommodation[]>, 'data' | 'pagination'>>;
  findById: (id: string) => Promise<Accommodation | null>;
  create: (payload: AccommodationInput) => Promise<InsertOneResult>;
  createMany: (payload: AccommodationInput[]) => Promise<InsertManyResult>;
  update: (id: string, payload: AccommodationInput) => Promise<UpdateResult>;
  delete: (id: string) => Promise<DeleteResult>;
  deleteMany: (filter?: Filter<Document>) => Promise<DeleteResult>;
};

const accommodationModel: AccommodationModel = {
  findAll: async () => {
    const accommodationsCache = await redis.get('accommodations');

    if (accommodationsCache) {
      return JSON.parse(accommodationsCache) as Accommodation[];
    }

    const accommodations = (await db
      .collection('accommodations')
      .find()
      .toArray()) as Accommodation[];

    await redis.set('accommodations', JSON.stringify(accommodations));

    return accommodations;
  },
  findAllWithPagination: async (search: string = '', page: number = 1, limit: number = 10) => {
    if (!search) {
      const accommodationsWithPaginationCache = await redis.get(`accommodations:${page}:${limit}`);

      if (accommodationsWithPaginationCache) {
        return JSON.parse(accommodationsWithPaginationCache) as Pick<
          BaseResponse<Accommodation[]>,
          'data' | 'pagination'
        >;
      }
    }

    const accommodations = (await db
      .collection('accommodations')
      .aggregate([
        {
          $match: {
            name: { $regex: search, $options: 'i' },
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
      .toArray()) as Accommodation[];

    const count = await db.collection('accommodations').countDocuments({
      name: { $regex: search, $options: 'i' },
    });

    const result = {
      data: accommodations,
      pagination: {
        totalData: count,
        currentPage: page,
        totalPage: Math.ceil(count / limit),
        nextPage: page < Math.ceil(count / limit) ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
      },
    };

    if (!search) {
      await redis.set(`accommodations:${page}:${limit}`, JSON.stringify(result));
    }

    return result;
  },
  findById: async (id: string) => {
    const accommodation = (await db
      .collection('accommodations')
      .findOne({ _id: ObjectId.createFromHexString(id) })) as Accommodation | null;

    return accommodation;
  },
  create: async (payload: AccommodationInput) => {
    const result = await db.collection('accommodations').insertOne({
      ...payload,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const caches = await redis.keys('accommodations*');

    if (!!caches.length) {
      await redis.del(caches);
    }

    return result;
  },
  createMany: async (payload: AccommodationInput[]) => {
    const result = await db.collection('accommodations').insertMany(
      payload.map((item) => ({
        ...item,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    );

    const caches = await redis.keys('accommodations*');

    if (!!caches.length) {
      await redis.del(caches);
    }

    return result;
  },
  update: async (id: string, payload: AccommodationInput) => {
    const result = await db
      .collection('accommodations')
      .updateOne({ _id: ObjectId.createFromHexString(id) }, { $set: payload });

    const caches = await redis.keys('accommodations*');

    if (!!caches.length) {
      await redis.del(caches);
    }

    return result;
  },
  delete: async (id: string) => {
    const result = await db
      .collection('accommodations')
      .deleteOne({ _id: ObjectId.createFromHexString(id) });

    const caches = await redis.keys('accommodations*');

    if (!!caches.length) {
      await redis.del(caches);
    }

    return result;
  },
  deleteMany: async (filter: Filter<Document> = {}) => {
    const result = await db.collection('accommodations').deleteMany(filter);

    const caches = await redis.keys('accommodations*');

    if (!!caches.length) {
      await redis.del(caches);
    }

    return result;
  },
};

export default accommodationModel;
