import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from 'mongodb';

import { db } from '../lib/mongodb';

import type { Guide, GuideInput } from '../types/guide';

type GuideModel = {
  findAll: () => Promise<Guide[]>;
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
