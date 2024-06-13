import destinationModel from '../models/destinationModel';

import type { NextFunction, Request } from 'express';
import type { CustomResponse } from '../types/response';
import type { DestinationInput } from '../types/destination';

const destinationController = {
  getAllDestinations: async (_req: Request, res: CustomResponse, next: NextFunction) => {
    try {
      const destinations = await destinationModel.findAll();

      res.status(200).json({
        statusCode: 200,
        message: 'Destinations retrieved successfully',
        data: destinations,
      });
    } catch (error) {
      next(error);
    }
  },
  getDestinationById: async (req: Request, res: CustomResponse, next: NextFunction) => {
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
  createDestination: async (req: Request, res: CustomResponse, next: NextFunction) => {
    try {
      const payload: DestinationInput = req.body;
      const result = await destinationModel.create(payload);

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
  updateDestination: async (req: Request, res: CustomResponse, next: NextFunction) => {
    try {
      const { id } = req.params;

      const payload: DestinationInput = req.body;
      const result = await destinationModel.update(id, payload);

      if (result.matchedCount === 0) {
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
  deleteDestination: async (req: Request, res: CustomResponse, next: NextFunction) => {
    try {
      const { id } = req.params;

      const result = await destinationModel.delete(id);

      if (result.deletedCount === 0) {
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
};

export default destinationController;
