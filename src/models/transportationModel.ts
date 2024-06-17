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

import type { Transportation, TransportationInput } from '../types/transportation';
import type { BaseResponse } from '../types/response';

type TransportationModel = {
  findAll: () => Promise<Transportation[]>;
  findAllWithPagination: (
    search?: string,
    page?: number,
    limit?: number
  ) => Promise<Pick<BaseResponse<Transportation[]>, 'data' | 'pagination'>>;
  findById: (id: string) => Promise<Transportation | null>;
  create: (payload: TransportationInput) => Promise<InsertOneResult>;
  createMany: (payload: TransportationInput[]) => Promise<InsertManyResult>;
  update: (id: string, payload: TransportationInput) => Promise<UpdateResult>;
  delete: (id: string) => Promise<DeleteResult>;
  deleteMany: (filter?: Filter<Document>) => Promise<DeleteResult>;
};

const transportationModel: TransportationModel = {
  findAll: async () => {
    const transportationsCache = await redis.get('transportations');

    if (transportationsCache) {
      return JSON.parse(transportationsCache) as Transportation[];
    }

    const transportations = (await db
      .collection('transportations')
      .find()
      .toArray()) as Transportation[];

    await redis.set('transportations', JSON.stringify(transportations));

    return transportations;
  },
  findAllWithPagination: async (search: string = '', page: number = 1, limit: number = 10) => {
    if (!search) {
      const transportationsWithPaginationCache = await redis.get(
        `transportations:${page}:${limit}`
      );

      if (transportationsWithPaginationCache) {
        return JSON.parse(transportationsWithPaginationCache) as Pick<
          BaseResponse<Transportation[]>,
          'data' | 'pagination'
        >;
      }
    }

    const transportations = (await db
      .collection('transportations')
      .aggregate([
        {
          $match: {
            $or: [
              { type: { $regex: search, $options: 'i' } },
              { company: { $regex: search, $options: 'i' } },
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
      .toArray()) as Transportation[];

    const count = await db.collection('transportations').countDocuments({
      $or: [
        { type: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ],
    });

    const result = {
      data: transportations,
      pagination: {
        totalData: count,
        currentPage: page,
        totalPage: Math.ceil(count / limit),
        nextPage: page < Math.ceil(count / limit) ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
      },
    };

    if (!search) {
      await redis.set(`transportations:${page}:${limit}`, JSON.stringify(result));
    }

    return result;
  },
  findById: async (id: string) => {
    const transportation = (await db
      .collection('transportations')
      .findOne({ _id: ObjectId.createFromHexString(id) })) as Transportation | null;

    return transportation;
  },
  create: async (payload: TransportationInput) => {
    const result = await db.collection('transportations').insertOne({
      ...payload,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const caches = await redis.keys('transportations*');

    if (!!caches.length) {
      await redis.del(caches);
    }

    return result;
  },
  createMany: async (payload: TransportationInput[]) => {
    const result = await db.collection('transportations').insertMany(
      payload.map((transportation) => ({
        ...transportation,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    );

    const caches = await redis.keys('transportations*');

    if (!!caches.length) {
      await redis.del(caches);
    }

    return result;
  },
  update: async (id: string, payload: TransportationInput) => {
    const result = await db
      .collection('transportations')
      .updateOne({ _id: ObjectId.createFromHexString(id) }, { $set: payload });

    const caches = await redis.keys('transportations*');

    if (!!caches.length) {
      await redis.del(caches);
    }

    return result;
  },
  delete: async (id: string) => {
    const result = await db
      .collection('transportations')
      .deleteOne({ _id: ObjectId.createFromHexString(id) });

    const caches = await redis.keys('transportations*');

    if (!!caches.length) {
      await redis.del(caches);
    }

    return result;
  },
  deleteMany: async (filter: Filter<Document> = {}) => {
    const result = await db.collection('transportations').deleteMany(filter);

    const caches = await redis.keys('transportations*');

    if (!!caches.length) {
      await redis.del(caches);
    }

    return result;
  },
};

export default transportationModel;
