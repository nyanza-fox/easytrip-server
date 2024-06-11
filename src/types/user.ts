import { ObjectId } from 'mongodb';

export type User = {
  _id: ObjectId;
  role: 'admin' | 'user';
  email: string;
  password: string;
  profile: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    dateOfBirth: string;
  };
  createdAt: string;
  updatedAt: string;
};
