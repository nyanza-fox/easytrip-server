import { ObjectId } from 'mongodb';

export type Guide = {
  _id: ObjectId;
  name: string;
  languages: string[];
  pricePerDay: number;
  contact: {
    email: string;
    phone: string;
  };
  createdAt: Date;
  updatedAt: Date;
};
