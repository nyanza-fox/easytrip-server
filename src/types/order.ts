import { ObjectId } from 'mongodb';

export type Order = {
  _id: ObjectId;
  userId: ObjectId;
  destinationId: ObjectId;
  totalPrice: number;
  status: 'pending' | 'completed' | 'cancelled';
  itinerary: {
    date: Date;
    activities: string[];
  }[];
  transportations: {
    transportationId: ObjectId;
    quantity: number;
    price: number;
  }[];
  accommodations: {
    accommodationId: ObjectId;
    checkIn: Date;
    checkOut: Date;
    price: number;
  }[];
  guides: {
    guideId: ObjectId;
    date: Date;
    price: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
};
