import { ObjectId } from 'mongodb';

export type Accommodation = {
  _id: ObjectId;
  name: string;
  type: string;
  images: string[];
  facilities: string[];
  maxGuests: number;
  pricePerNight: number;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  contact: {
    email: string;
    phoneNumber: string;
  };
  createdAt: Date;
  updatedAt: Date;
};

export type AccommodationInput = Omit<Accommodation, '_id' | 'createdAt' | 'updatedAt'>;
