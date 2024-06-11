import { db } from '../lib/mongodb';

import type { Transportation } from '../types/transportation';

type TransportationModel = {
  findAll: () => Promise<Transportation[]>;
};

const transportationModel: TransportationModel = {
  findAll: async () => {
    const transportations = (await db
      .collection('transportations')
      .find()
      .toArray()) as Transportation[];
    return transportations;
  },
};

export default transportationModel;
