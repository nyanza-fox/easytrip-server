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

import type { Destination, DestinationInput } from '../types/destination';
import type { BaseResponse } from '../types/response';
import redis from '../lib/redis';

type DestinationModel = {
  findAll: () => Promise<Destination[]>;
  findAllWithPagination: (
    search?: string,
    page?: number,
    limit?: number
  ) => Promise<Pick<BaseResponse<Destination[]>, 'data' | 'pagination'>>;
  findById: (id: string) => Promise<Destination | null>;
  create: (payload: DestinationInput) => Promise<InsertOneResult>;
  createMany: (payload: DestinationInput[]) => Promise<InsertManyResult>;
  update: (id: string, payload: DestinationInput) => Promise<UpdateResult>;
  delete: (id: string) => Promise<DeleteResult>;
  deleteMany: (filter?: Filter<Document>) => Promise<DeleteResult>;
};

const destinationModel: DestinationModel = {
  findAll: async () => {
    const destinationsCache = await redis.get('destinations');

    if (destinationsCache) {
      return JSON.parse(destinationsCache) as Destination[];
    }

    const destinations = (await db.collection('destinations').find().toArray()) as Destination[];

    await redis.set('destinations', JSON.stringify(destinations));

    return destinations;
  },
  findAllWithPagination: async (search: string = '', page: number = 1, limit: number = 10) => {
    if (!search) {
      const destinationsWithPaginationCache = await redis.get(`destinations:${page}:${limit}`);

      if (destinationsWithPaginationCache) {
        return JSON.parse(destinationsWithPaginationCache) as Pick<
          BaseResponse<Destination[]>,
          'data' | 'pagination'
        >;
      }
    }

    const destinations = (await db
      .collection('destinations')
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
      .toArray()) as Destination[];

    const count = await db.collection('destinations').countDocuments({
      name: { $regex: search, $options: 'i' },
    });

    const result = {
      data: destinations,
      pagination: {
        totalData: count,
        currentPage: page,
        totalPage: Math.ceil(count / limit),
        nextPage: page < Math.ceil(count / limit) ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
      },
    };

    if (!search) {
      await redis.set(`destinations:${page}:${limit}`, JSON.stringify(result));
    }

    return result;
  },
  findById: async (id: string) => {
    const destination = (await db.collection('destinations').findOne({
      _id: ObjectId.createFromHexString(id),
    })) as Destination | null;

    return destination;
  },
  create: async (payload: DestinationInput) => {
    const result = await db.collection('destinations').insertOne({
      ...payload,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const caches = await redis.keys('destinations*');

    if (!!caches.length) {
      await redis.del(caches);
    }

    return result;
  },
  createMany: async (payload: DestinationInput[]) => {
    const result = await db.collection('destinations').insertMany(
      payload.map((item) => ({
        ...item,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    );

    const caches = await redis.keys('destinations*');

    if (!!caches.length) {
      await redis.del(caches);
    }

    return result;
  },
  update: async (id: string, payload: DestinationInput) => {
    const result = await db
      .collection('destinations')
      .updateOne({ _id: ObjectId.createFromHexString(id) }, { $set: payload });

    const caches = await redis.keys('destinations*');

    if (!!caches.length) {
      await redis.del(caches);
    }

    return result;
  },
  delete: async (id: string) => {
    const result = await db
      .collection('destinations')
      .deleteOne({ _id: ObjectId.createFromHexString(id) });

    const caches = await redis.keys('destinations*');

    if (!!caches.length) {
      await redis.del(caches);
    }

    return result;
  },
  deleteMany: async (filter: Filter<Document> = {}) => {
    const result = await db.collection('destinations').deleteMany(filter);

    const caches = await redis.keys('destinations*');

    if (!!caches.length) {
      await redis.del(caches);
    }

    return result;
  },
};

export default destinationModel;
