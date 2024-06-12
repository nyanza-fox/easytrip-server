import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from 'mongodb';

import { db } from '../lib/mongodb';

import type { Transportation, TransportationInput } from '../types/transportation';

type TransportationModel = {
  findAll: () => Promise<Transportation[]>;
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
