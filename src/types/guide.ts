import { ObjectId } from 'mongodb';

import type { Contact, Location } from './globals';

export type Guide = {
  _id: ObjectId;
  name: string;
  languages: string[];
  rating: number;
  image: string;
  pricePerDay: number;
  location: Location;
  contact: Contact;
  createdAt: Date;
  updatedAt: Date;
};

export type GuideInput = Omit<Guide, '_id' | 'createdAt' | 'updatedAt'>;
