import { ObjectId } from 'mongodb';

export type Guide = {
  _id: ObjectId;
  name: string;
  languages: string[];
  pricePerDay: number;
  contact: {
    email: string;
    phoneNumber: string;
  };
  createdAt: Date;
  updatedAt: Date;
};

export type GuideInput = Omit<Guide, '_id' | 'createdAt' | 'updatedAt'>;
