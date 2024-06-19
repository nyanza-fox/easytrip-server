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

import type { Guide, GuideInput } from '../types/guide';
import type { BaseResponse } from '../types/response';

type GuideModel = {
  findAll: () => Promise<Guide[]>;
  findAllWithPagination: (
    search?: string,
    page?: number,
    limit?: number
  ) => Promise<Pick<BaseResponse<Guide[]>, 'data' | 'pagination'>>;
  findById: (id: string) => Promise<Guide | null>;
  create: (payload: GuideInput) => Promise<InsertOneResult>;
  createMany: (payload: GuideInput[]) => Promise<InsertManyResult>;
  update: (id: string, payload: GuideInput) => Promise<UpdateResult>;
  delete: (id: string) => Promise<DeleteResult>;
  deleteMany: (filter?: Filter<Document>) => Promise<DeleteResult>;
};

const guideModel: GuideModel = {
  findAll: async () => {
    const guidesCache = await redis.get('guides');

    if (guidesCache) {
      return JSON.parse(guidesCache) as Guide[];
    }

    const guides = (await db.collection('guides').find().toArray()) as Guide[];

    await redis.set('guides', JSON.stringify(guides));

    return guides;
  },
  findAllWithPagination: async (search: string = '', page: number = 1, limit: number = 10) => {
    if (!search) {
      const guidesWithPaginationCache = await redis.get(`guides:${page}:${limit}`);

      if (guidesWithPaginationCache) {
        return JSON.parse(guidesWithPaginationCache) as Pick<
          BaseResponse<Guide[]>,
          'data' | 'pagination'
        >;
      }
    }

    const guides = (await db
      .collection('guides')
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
      .toArray()) as Guide[];

    const count = await db.collection('guides').countDocuments({
      name: { $regex: search, $options: 'i' },
    });

    const result = {
      data: guides,
      pagination: {
        totalData: count,
        currentPage: page,
        totalPage: Math.ceil(count / limit),
        nextPage: page < Math.ceil(count / limit) ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
      },
    };

    if (!search) {
      await redis.set(`guides:${page}:${limit}`, JSON.stringify(result));
    }

    return result;
  },
  findById: async (id: string) => {
    const guide = (await db
      .collection('guides')
      .findOne({ _id: ObjectId.createFromHexString(id) })) as Guide | null;

    return guide;
  },
  create: async (payload: GuideInput) => {
    const result = await db.collection('guides').insertOne({
      ...payload,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const caches = await redis.keys('guides*');

    if (!!caches.length) {
      await redis.del(caches);
    }

    return result;
  },
  createMany: async (payload: GuideInput[]) => {
    const result = await db.collection('guides').insertMany(
      payload.map((guide) => ({
        ...guide,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    );

    const caches = await redis.keys('guides*');

    if (!!caches.length) {
      await redis.del(caches);
    }

    return result;
  },
  update: async (id: string, payload: GuideInput) => {
    const result = await db
      .collection('guides')
      .updateOne({ _id: ObjectId.createFromHexString(id) }, { $set: payload });

    const caches = await redis.keys('guides*');

    if (!!caches.length) {
      await redis.del(caches);
    }

    return result;
  },
  delete: async (id: string) => {
    const result = await db
      .collection('guides')
      .deleteOne({ _id: ObjectId.createFromHexString(id) });

    const caches = await redis.keys('guides*');

    if (!!caches.length) {
      await redis.del(caches);
    }

    return result;
  },
  deleteMany: async (filter: Filter<Document> = {}) => {
    const result = await db.collection('guides').deleteMany(filter);

    const caches = await redis.keys('guides*');

    if (!!caches.length) {
      await redis.del(caches);
    }

    return result;
  },
};

export default guideModel;
