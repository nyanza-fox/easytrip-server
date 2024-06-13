import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from 'mongodb';

import { db } from '../lib/mongodb';

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
  update: (id: string, payload: TransportationInput) => Promise<UpdateResult>;
  delete: (id: string) => Promise<DeleteResult>;
};

const transportationModel: TransportationModel = {
  findAll: async () => {
    const transportations = (await db
      .collection('transportations')
      .find()
      .toArray()) as Transportation[];

    return transportations;
  },
  findAllWithPagination: async (search: string = '', page: number = 1, limit: number = 10) => {
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

    return {
      data: transportations,
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
    const transportation = (await db
      .collection('transportations')
      .findOne({ _id: ObjectId.createFromHexString(id) })) as Transportation | null;

    return transportation;
  },
  create: async (payload: TransportationInput) => {
    const result = await db.collection('transportations').insertOne(payload);

    return result;
  },
  update: async (id: string, payload: TransportationInput) => {
    const result = await db
      .collection('transportations')
      .updateOne({ _id: ObjectId.createFromHexString(id) }, { $set: payload });

    return result;
  },
  delete: async (id: string) => {
    const result = await db
      .collection('transportations')
      .deleteOne({ _id: ObjectId.createFromHexString(id) });

    return result;
  },
};

export default transportationModel;
