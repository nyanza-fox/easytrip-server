import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from 'mongodb';

import { db } from '../lib/mongodb';

import type { Destination, DestinationInput } from '../types/destination';

type DestinationModel = {
  findAll: () => Promise<Destination[]>;
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
  findById: async (id: string) => {
    const destination = (await db
      .collection('destinations')
      .findOne({ _id: ObjectId.createFromHexString(id) })) as Destination | null;

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
