import { db } from '../lib/mongodb';

import type { Accommodation } from '../types/accommodation';

type AccommodationModel = {
  findAll: () => Promise<Accommodation[]>;
};

const accommodationModel: AccommodationModel = {
  findAll: async () => {
    const accommodations = (await db
      .collection('accommodations')
      .find()
      .toArray()) as Accommodation[];
    return accommodations;
  },
};

export default accommodationModel;
