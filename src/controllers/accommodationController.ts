import accommodationModel from '../models/accommodationModel';

import type { NextFunction, Request } from 'express';
import type { AccommodationInput } from '../types/accommodation';
import type { CustomResponse } from '../types/response';

const accommodationController = {
  getAllAccommodations: async (req: Request, res: CustomResponse, next: NextFunction) => {
    try {
      const { search, page, limit } = req.query;

      const { data, pagination } = await accommodationModel.findAllWithPagination(
        search?.toString() || '',
        Number(page || 1),
        Number(limit || 10)
      );

      res.status(200).json({
        statusCode: 200,
        message: 'Accommodations retrieved successfully',
        data,
        pagination,
      });
    } catch (error) {
      next(error);
    }
  },
  getAccommodationById: async (req: Request, res: CustomResponse, next: NextFunction) => {
    try {
      const { id } = req.params;

      const accommodation = await accommodationModel.findById(id);

      if (!accommodation) {
        return next({
          statusCode: 404,
          name: 'Not Found',
          message: 'Accommodation not found',
        });
      }

      res.status(200).json({
        statusCode: 200,
        message: 'Accommodation retrieved successfully',
        data: accommodation,
      });
    } catch (error) {
      next(error);
    }
  },
  createAccommodation: async (req: Request, res: CustomResponse, next: NextFunction) => {
    try {
      const payload: AccommodationInput = req.body;
      const result = await accommodationModel.create(payload);

      const accommodation = await accommodationModel.findById(result.insertedId.toHexString());

      res.status(201).json({
        statusCode: 201,
        message: 'Accommodation created successfully',
        data: accommodation,
      });
    } catch (error) {
      next(error);
    }
  },
  updateAccommodation: async (req: Request, res: CustomResponse, next: NextFunction) => {
    try {
      const { id } = req.params;

      const payload: AccommodationInput = req.body;
      const result = await accommodationModel.update(id, payload);

      if (result.modifiedCount === 0) {
        return next({
          statusCode: 404,
          name: 'Not Found',
          message: 'Accommodation not found',
        });
      }

      const accommodation = await accommodationModel.findById(id);

      res.status(200).json({
        statusCode: 200,
        message: 'Accommodation updated successfully',
        data: accommodation,
      });
    } catch (error) {
      next(error);
    }
  },
  deleteAccommodation: async (req: Request, res: CustomResponse, next: NextFunction) => {
    try {
      const { id } = req.params;

      const result = await accommodationModel.delete(id);

      if (result.deletedCount === 0) {
        return next({
          statusCode: 404,
          name: 'Not Found',
          message: 'Accommodation not found',
        });
      }

      res.status(200).json({
        statusCode: 200,
        message: 'Accommodation deleted successfully',
        data: null,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default accommodationController;
