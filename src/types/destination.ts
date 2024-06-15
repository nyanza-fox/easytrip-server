import { ObjectId } from 'mongodb';

import type { Location } from './globals';

export type Destination = {
  _id: ObjectId;
  name: string;
  description: string;
  images: string[];
  attractions: string[];
  price: number;
  location: Location;
  createdAt: Date;
  updatedAt: Date;
};

export type DestinationInput = Omit<Destination, '_id' | 'createdAt' | 'updatedAt'>;
