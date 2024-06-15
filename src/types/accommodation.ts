import { ObjectId } from 'mongodb';

import type { Contact, Location } from './globals';

export type Accommodation = {
  _id: ObjectId;
  name: string;
  type: string;
  rating: number;
  images: string[];
  facilities: string[];
  maxGuests: number;
  pricePerNight: number;
  location: Location;
  contact: Contact;
  createdAt: Date;
  updatedAt: Date;
};

export type AccommodationInput = Omit<Accommodation, '_id' | 'createdAt' | 'updatedAt'>;
