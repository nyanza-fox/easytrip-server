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
    dateOfBirth: Date;
  };
  createdAt: Date;
  updatedAt: Date;
};

export type UserInput = Omit<User, '_id' | 'createdAt' | 'updatedAt'>;
