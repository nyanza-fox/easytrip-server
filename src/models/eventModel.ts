import { db } from '../lib/mongodb';

const eventModel = {
  findAll: async () => {
    const events = await db.collection('events').find().toArray();
    return events;
  },
};

export default eventModel;
