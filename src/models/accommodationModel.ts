import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from 'mongodb';

import { db } from '../lib/mongodb';

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
  update: (id: string, payload: AccommodationInput) => Promise<UpdateResult>;
  delete: (id: string) => Promise<DeleteResult>;
};

const accommodationModel: AccommodationModel = {
  findAll: async () => {
    const accommodations = (await db
      .collection('accommodations')
      .find()
      .toArray()) as Accommodation[];

    return accommodations;
  },
  findAllWithPagination: async (search: string = '', page: number = 1, limit: number = 10) => {
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

    return {
      data: accommodations,
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

    return result;
  },
  update: async (id: string, payload: AccommodationInput) => {
    const result = await db
      .collection('accommodations')
      .updateOne({ _id: ObjectId.createFromHexString(id) }, { $set: payload });

    return result;
  },
  delete: async (id: string) => {
    const result = await db
      .collection('accommodations')
      .deleteOne({ _id: ObjectId.createFromHexString(id) });

    return result;
  },
};

export default accommodationModel;
