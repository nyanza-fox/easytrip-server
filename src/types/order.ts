import { ObjectId } from 'mongodb';

export type Order = {
  _id: ObjectId;
  userId: ObjectId;
  totalPrice: number;
  status: 'pending' | 'completed' | 'cancelled';
  itinerary: Itinerary[];
  destination: {
    destinationId: ObjectId;
    price: number;
  };
  transportations: {
    transportationId: ObjectId;
    quantity: number;
    price: number;
  }[];
  accommodation: {
    accommodationId: ObjectId;
    checkIn: Date;
    checkOut: Date;
    price: number;
  };
  guide: {
    guideId: ObjectId;
    date: Date;
    price: number;
  };
  createdAt: Date;
  updatedAt: Date;
};

export type Itinerary = {
  date: Date;
  activities: {
    time: string;
    name: string;
  }[];
};

export type Package = {
  type: 'affordable' | 'standard' | 'luxury';
  destinationId: string;
  transportationsId: string[];
  accommodationId: string;
  guideId: string;
};

export type OrderInput = Omit<Order, '_id' | 'status' | 'createdAt' | 'updatedAt'>;
