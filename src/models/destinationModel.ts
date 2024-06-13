import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from 'mongodb';

import { db } from '../lib/mongodb';

import type { Destination, DestinationInput } from '../types/destination';
import type { BaseResponse } from '../types/response';

type DestinationModel = {
  findAll: () => Promise<Destination[]>;
  findAllWithPagination: (
    search?: string,
    page?: number,
    limit?: number
  ) => Promise<Pick<BaseResponse<Destination[]>, 'data' | 'pagination'>>;
  findById: (id: string) => Promise<Destination | null>;
  create: (payload: DestinationInput) => Promise<InsertOneResult>;
  update: (id: string, payload: DestinationInput) => Promise<UpdateResult>;
  delete: (id: string) => Promise<DeleteResult>;
};

const destinationModel: DestinationModel = {
  findAll: async () => {
    const destinations = (await db.collection('destinations').find().toArray()) as Destination[];

    return destinations;
  },
  findAllWithPagination: async (search: string = '', page: number = 1, limit: number = 10) => {
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

    return {
      data: destinations,
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
    const destination = (await db.collection('destinations').findOne({
      _id: ObjectId.createFromHexString(id),
    })) as Destination | null;

    return destination;
  },
  create: async (payload: DestinationInput) => {
    const result = await db.collection('destinations').insertOne(payload);

    return result;
  },
  update: async (id: string, payload: DestinationInput) => {
    const result = await db
      .collection('destinations')
      .updateOne({ _id: ObjectId.createFromHexString(id) }, { $set: payload });

    return result;
  },
  delete: async (id: string) => {
    const result = await db
      .collection('destinations')
      .deleteOne({ _id: ObjectId.createFromHexString(id) });

    return result;
  },
};

export default destinationModel;
