import { NextFunction } from 'express';

import { chatCompletion } from '../lib/openai';
import accommodationModel from '../models/accommodationModel';
import destinationModel from '../models/destinationModel';
import guideModel from '../models/guideModel';
import transportationModel from '../models/transportationModel';

import type { CustomRequest, CustomResponse } from '../types/express';
import type { Itinerary } from '../types/order';

const destinationController = {
  getAllDestinations: async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    try {
      const { search, page, limit } = req.query;

      const { data, pagination } = await destinationModel.findAllWithPagination(
        search?.toString() || '',
        Number(page || 1),
        Number(limit || 10)
      );

      res.status(200).json({
        statusCode: 200,
        message: 'Destinations retrieved successfully',
        data,
        pagination,
      });
    } catch (error) {
      next(error);
    }
  },
  getDestinationById: async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    try {
      const { id } = req.params;

      const destination = await destinationModel.findById(id);

      if (!destination) {
        return next({
          statusCode: 404,
          name: 'Not Found',
          message: 'Destination not found',
        });
      }

      res.status(200).json({
        statusCode: 200,
        message: 'Destination retrieved successfully',
        data: destination,
      });
    } catch (error) {
      next(error);
    }
  },
  createDestination: async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    try {
      const result = await destinationModel.create(req.body);
      const destination = await destinationModel.findById(result.insertedId.toHexString());

      res.status(201).json({
        statusCode: 201,
        message: 'Destination created successfully',
        data: destination,
      });
    } catch (error) {
      next(error);
    }
  },
  updateDestination: async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    try {
      const { id } = req.params;

      const result = await destinationModel.update(id, req.body);

      if (!result.matchedCount) {
        return next({
          statusCode: 404,
          name: 'Not Found',
          message: 'Destination not found',
        });
      }

      const destination = await destinationModel.findById(id);

      res.status(200).json({
        statusCode: 200,
        message: 'Destination updated successfully',
        data: destination,
      });
    } catch (error) {
      next(error);
    }
  },
  deleteDestination: async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    try {
      const { id } = req.params;

      const result = await destinationModel.delete(id);

      if (!result.deletedCount) {
        return next({
          statusCode: 404,
          name: 'Not Found',
          message: 'Destination not found',
        });
      }

      res.status(200).json({
        statusCode: 200,
        message: 'Destination deleted successfully',
        data: null,
      });
    } catch (error) {
      next(error);
    }
  },
  generateDestinationsByPrompt: async (
    req: CustomRequest,
    res: CustomResponse,
    next: NextFunction
  ) => {
    try {
      const { prompt } = req.body;

      // Get all destinations, then map the necessary fields.
      const destinations = (await destinationModel.findAll()).map((destination) => ({
        _id: destination._id,
        name: destination.name,
        description: destination.description,
        attractions: destination.attractions,
        price: destination.price,
        location: {
          city: destination.location.city || '',
          country: destination.location.country,
        },
      }));

      // Generate destinations based on the user's prompt.
      const completion: { destinations: { _id: string }[] } = await chatCompletion([
        {
          role: 'system',
          content: `You are a travel agent that helps users find 1-6 destinations from database based on their preferences. This is the list of destinations in the database: ${JSON.stringify(
            destinations
          )}. Provide your answer in JSON structure like this: { "destinations": [{ "_id": "1" }] }. If there is no destination that matches the user's preferences, provide an empty array like this: { "destinations": [] }.`,
        },
        {
          role: 'user',
          content: 'Provide 1-6 destinations related to "beach view".',
        },
        {
          role: 'assistant',
          content:
            '{ "destinations": [{ "_id": "6671136255a13f10abee2517"}, {"_id": "6671136255a13f10abee2519"}] }',
        },
        {
          role: 'user',
          content: `Provide 1-6 destinations related to "${prompt}"`,
        },
      ]);

      // Get the destinations based on the generated IDs.
      const data = await Promise.all(
        completion.destinations.map(
          async (dest) => await destinationModel.findById(dest._id).catch(() => null)
        )
      );

      res.status(200).json({
        statusCode: 200,
        message: 'Destinations generated successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  },
  generateDestinationPackages: async (
    req: CustomRequest,
    res: CustomResponse,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const { departureState, totalGuests, startDate, endDate } = req.body;

      // Get the destination by ID.
      const destination = await destinationModel.findById(id);

      // If the destination is not found, return an error.
      if (!destination) {
        return next({
          statusCode: 404,
          name: 'Not Found',
          message: 'Destination not found',
        });
      }

      // Get all accommodations, transportations, and guides, then map the necessary fields.
      const accommodations = (await accommodationModel.findAll()).map((accommodation) => ({
        _id: accommodation._id,
        rating: accommodation.rating,
        pricePerNight: accommodation.pricePerNight,
        location: {
          city: accommodation.location.city,
          state: accommodation.location.state,
          country: accommodation.location.country,
        },
      }));
      const transportations = (await transportationModel.findAll()).map((transportation) => ({
        _id: transportation._id,
        price: transportation.price,
        departure: {
          location: {
            city: transportation.departure.location.city,
            state: transportation.departure.location.state,
            country: transportation.departure.location.country,
          },
        },
        arrival: {
          location: {
            city: transportation.arrival.location.city,
            state: transportation.arrival.location.state,
            country: transportation.arrival.location.country,
          },
        },
      }));
      const guides = (await guideModel.findAll()).map((guide) => ({
        _id: guide._id,
        rating: guide.rating,
        pricePerDay: guide.pricePerDay,
        location: {
          city: guide.location.city,
          state: guide.location.state,
          country: guide.location.country,
        },
      }));

      // Generate travel packages based on the selected destination.
      const completion: {
        packages: {
          destinationId: string;
          accommodationId: string;
          guideId: string;
          transportationsId: string[];
        }[];
      } = await chatCompletion([
        {
          role: 'system',
          content: `You are a travel agent that helps users generate 3 travel packages from the selected destination based on the rating or price of transportations, accommodations, and guides available in the database. First transportation must depart from the selected state and arrive in the destination's state. Second transportation must depart from the destination's state and arrive in the selected state. Accommodation and guide must be in the same city or state as the destination. Max guests of accommodation must be more than or equal to total guests. Choose transportations, accommodation, and guide that have the lowest rating or price for first package, medium rating or price for second package, and highest rating or price for third package. This is the list of transportations in the database: ${JSON.stringify(
            transportations
          )}. This is the list of accommodations in the database: ${JSON.stringify(
            accommodations
          )}. This is the list of guides in the database: ${JSON.stringify(
            guides
          )}. Provide your answer in JSON structure like this: { "packages": [{ "destinationId": "1", "accommodationId": "1", "guideId": "1", "transportationsId": ["1", "2"] }, { "destinationId": "1", "accommodationId": "1", "guideId": "1", "transportationsId": ["1", "2"] }, { "destinationId": "1", "accommodationId": "1", "guideId": "1", "transportationsId": ["1", "2"] }] }`,
        },
        {
          role: 'user',
          content:
            'Generate 3 travel packages, depart from Jakarta with a total of 2 guest(s) to this destination: { "_id": "6671136255a13f10abee2517", "location": { "city": "Klungkung", "state": "Bali", "country": "Indonesia" } }',
        },
        {
          role: 'assistant',
          content:
            '{ "packages": [{ "destinationId": "6671136255a13f10abee2517", "accommodationId": "6671136255a13f10abee250a", "guideId": "6671136355a13f10abee255a", "transportationsId": ["6671136355a13f10abee2567", "6671136355a13f10abee25af"] }, { "destinationId": "6671136255a13f10abee2517", "accommodationId": "6671136255a13f10abee2509", "guideId": "6671136355a13f10abee252b", "transportationsId": ["6671136355a13f10abee2567", "6671136355a13f10abee25af"] }, { "destinationId": "6671136255a13f10abee2517", "accommodationId": "6671136255a13f10abee250e", "guideId": "6671136355a13f10abee2559", "transportationsId": ["6671136355a13f10abee2567", "6671136355a13f10abee25af"] }] }',
        },
        {
          role: 'user',
          content: `Generate 3 travel packages, depart from ${departureState} with a total of ${totalGuests} guest(s) to this destination: ${JSON.stringify(
            {
              _id: destination._id,
              location: {
                city: destination.location.city,
                state: destination.location.state,
                country: destination.location.country,
              },
            }
          )}`,
        },
      ]);

      // Get the accommodations, guides, and transportations based on the generated IDs.
      const packages = await Promise.all(
        completion.packages.map(async (pack) => ({
          destination,
          accommodation: await accommodationModel.findById(pack.accommodationId).catch(() => null),
          guide: await guideModel.findById(pack.guideId).catch(() => null),
          transportations: await Promise.all(
            pack.transportationsId
              .map(async (id) => await transportationModel.findById(id).catch(() => null))
              .filter((transportation) => transportation)
          ),
        }))
      );

      // Calculate the total days of the trip based on the start date and end date.
      const totalDays = new Date(endDate).getDate() - new Date(startDate).getDate() + 1 || 1;

      // Add the total guests, totalDays, and total price to each package.
      const data = packages
        .map((pack) => ({
          ...pack,
          totalGuests: +totalGuests,
          totalDays,
          totalPrice:
            (pack.accommodation?.pricePerNight || 0) * totalDays +
            (pack.guide?.pricePerDay || 0) * totalDays +
            pack.transportations.reduce((acc, curr) => acc + (curr?.price || 0) * totalGuests, 0),
        }))
        // Sort the packages based on the total price.
        .sort((a, b) => a.totalPrice - b.totalPrice)
        // Add the type to each package based on the index.
        .map((pack, index) => ({
          ...pack,
          type: index === 0 ? 'budget' : index === 1 ? 'standard' : 'luxury',
        }));

      res.status(200).json({
        statusCode: 200,
        message: 'Travel packages generated successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  },
  generateDestinationItinerary: async (
    req: CustomRequest,
    res: CustomResponse,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const { startDate, endDate } = req.body;

      // Get the destination by ID.
      const destination = await destinationModel.findById(id);

      // If the destination is not found, return an error.
      if (!destination) {
        return next({
          statusCode: 404,
          name: 'Not Found',
          message: 'Destination not found',
        });
      }

      // Generate itinerary for the selected destination based on the start date and end date.
      const completion: { itinerary: Itinerary[] } = await chatCompletion([
        {
          role: 'system',
          content: `You are a travel agent that helps users determine the itinerary for a trip to the selected destination. The itinerary must include activities that can be done at the destination from start date to end date. Provide your answer in JSON structure like this: { "itinerary": [{ "date": "2023-12-01", "activities": [{ "time": "08:00", "name": "Activity 1" }] }] }`,
        },
        {
          role: 'user',
          content:
            'Make the itinerary for a trip from "2023-12-01" to "2023-12-03" at this destination: { "_id": "6670c19aeb224ec4d2a38537", "name": "Nusa Penida", "description": "Nusa Penida, an island located southeast of Bali in Indonesia, is renowned for its stunning natural beauty, unique landscapes, and vibrant marine life.", "attractions": ["Kelingking Beach", "Goa Giri Putri Temple", "Angel\'s Billabong", "Tembeling Beach and Forest", "Crystal Bay"], "location": { "city": "Kabupaten Klungkung", "state": "Bali", "country": "Indonesia" } }',
        },
        {
          role: 'assistant',
          content:
            '{ "itinerary": [{ "date": "2023-12-01", "activities": [{ "time": "08:00", "name": "Breakfast at hotel" }, { "time": "10:00", "name": "Visit Kelingking Beach" }, { "time": "12:00", "name": "Lunch at local restaurant" }, { "time": "14:00", "name": "Explore Goa Giri Putri Temple" }, { "time": "16:00", "name": "Visit Angel\'s Billabong" }, { "time": "18:00", "name": "Dinner at beachfront restaurant" }] }, { "date": "2023-12-02", "activities": [{ "time": "08:00", "name": "Breakfast at hotel" }, { "time": "10:00", "name": "Visit Tembeling Beach and Forest" }, { "time": "12:00", "name": "Lunch at local restaurant" }, { "time": "14:00", "name": "Relax at Crystal Bay" }, { "time": "18:00", "name": "Dinner at beachfront restaurant" }] }, { "date": "2023-12-03", "activities": [{ "time": "08:00", "name": "Breakfast at hotel" }, { "time": "10:00", "name": "Check-out from hotel" }] }] }',
        },
        {
          role: 'user',
          content: `Make the itinerary for a trip from "${startDate}" to "${endDate}" at this destination: ${JSON.stringify(
            {
              _id: destination._id,
              name: destination.name,
              description: destination.description,
              attractions: destination.attractions,
              location: {
                city: destination.location.city,
                state: destination.location.state,
                country: destination.location.country,
              },
            }
          )}`,
        },
      ]);

      res.status(200).json({
        statusCode: 200,
        message: 'Itinerary generated successfully',
        data: completion.itinerary,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default destinationController;
