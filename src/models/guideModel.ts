import { db } from '../lib/mongodb';

import type { Guide } from '../types/guide';

type GuideModel = {
  findAll: () => Promise<Guide[]>;
};

const guideModel: GuideModel = {
  findAll: async () => {
    const guides = (await db.collection('guides').find().toArray()) as Guide[];
    return guides;
  },
};

export default guideModel;
