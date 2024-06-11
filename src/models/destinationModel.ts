import { ObjectId } from 'mongodb';
import { db } from '../lib/mongodb';

import type { Destination } from '../types/destination';

type DestinationModel = {
  findAll: () => Promise<Destination[]>;
  findById: (id: string) => Promise<Destination>;
};

const destinationModel: DestinationModel = {
  findAll: async () => {
    const destinations = (await db
      .collection('destinations')
      .find()
      .toArray()) as Destination[];
    return destinations;
  },

  findById: async (id: string) => {
    const destination = await db
      .collection('destinations')
      .findOne({ _id: new ObjectId(id) });
    return destination as Destination;
  },
};

export default destinationModel;
