import { ObjectId } from 'mongodb';

export type Destination = {
  _id: ObjectId;
  name: string;
  description: string;
  images: string[];
  attractions: string[];
  price: number;
  location: {
    city: string;
    country: string;
    coordinates: number[];
  };
  createdAt: Date;
  updatedAt: Date;
};

export type DestinationInput = Omit<Destination, '_id' | 'createdAt' | 'updatedAt'>;
