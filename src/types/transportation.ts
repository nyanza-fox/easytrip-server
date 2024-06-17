import { ObjectId } from 'mongodb';

import type { Location } from './globals';

export type Transportation = {
  _id: ObjectId;
  type: string;
  company: string;
  price: number;
  departure: {
    time: string;
    place: string;
    location: Location;
  };
  arrival: {
    time: string;
    place: string;
    location: Location;
  };
  createdAt: Date;
  updatedAt: Date;
};

export type TransportationInput = Omit<Transportation, '_id' | 'createdAt' | 'updatedAt'>;
