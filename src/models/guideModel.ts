import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from 'mongodb';

import { db } from '../lib/mongodb';

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
  update: (id: string, payload: GuideInput) => Promise<UpdateResult>;
  delete: (id: string) => Promise<DeleteResult>;
};

const guideModel: GuideModel = {
  findAll: async () => {
    const guides = (await db.collection('guides').find().toArray()) as Guide[];

    return guides;
  },
  findAllWithPagination: async (search: string = '', page: number = 1, limit: number = 10) => {
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

    return {
      data: guides,
      pagination: {
        totalData: count,
        currentPage: page,
        totalPage: Math.ceil(count / limit),
        nextPage: page < Math.ceil(count / limit) ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
      },
    };
  },
  findById: async (id: string) => {
    const guide = (await db
      .collection('guides')
      .findOne({ _id: ObjectId.createFromHexString(id) })) as Guide | null;

    return guide;
  },
  create: async (payload: GuideInput) => {
    const result = await db.collection('guides').insertOne(payload);

    return result;
  },
  update: async (id: string, payload: GuideInput) => {
    const result = await db
      .collection('guides')
      .updateOne({ _id: ObjectId.createFromHexString(id) }, { $set: payload });

    return result;
  },
  delete: async (id: string) => {
    const result = await db
      .collection('guides')
      .deleteOne({ _id: ObjectId.createFromHexString(id) });

    return result;
  },
};

export default guideModel;
