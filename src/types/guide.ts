import { ObjectId } from 'mongodb';

export type Guide = {
  _id: ObjectId;
  name: string;
  languages: string[];
  rating: number;
  image: string;
  pricePerDay: number;
  contact: {
    email: string;
    phoneNumber: string;
  };
  location: {
    city: string;
    country: string;
  };
  createdAt: Date;
  updatedAt: Date;
};

export type GuideInput = Omit<Guide, '_id' | 'createdAt' | 'updatedAt'>;
