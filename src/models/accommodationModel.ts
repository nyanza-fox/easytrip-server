import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from 'mongodb';

import { db } from '../lib/mongodb';

import type { Accommodation, AccommodationInput } from '../types/accommodation';

type AccommodationModel = {
  findAll: () => Promise<Accommodation[]>;
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
  findById: async (id: string) => {
    const accommodation = (await db
      .collection('accommodations')
      .findOne({ _id: ObjectId.createFromHexString(id) })) as Accommodation | null;

    return accommodation;
  },
  create: async (payload: AccommodationInput) => {
    const result = await db.collection('accommodations').insertOne(payload);

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
