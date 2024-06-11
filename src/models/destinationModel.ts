import { db } from '../lib/mongodb';

import type { Destination } from '../types/destination';

type DestinationModel = {
  findAll: () => Promise<Destination[]>;
};

const destinationModel: DestinationModel = {
  findAll: async () => {
    const destinations = (await db.collection('destinations').find().toArray()) as Destination[];
    return destinations;
  },
};

export default destinationModel;
