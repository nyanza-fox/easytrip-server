import { ObjectId } from 'mongodb';

export type Destination = {
  _id: ObjectId;
  name: string;
  description: string;
  images: string[];
  attractions: string[];
  bestSeason: string;
  price: number;
  location: {
    city: string;
    country: string;
    coordinates: number[];
  };
  createdAt: Date;
  updatedAt: Date;
};