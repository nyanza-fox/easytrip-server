import { NextFunction } from 'express';

import accommodationModel from '../models/accommodationModel';

import type { CustomRequest, CustomResponse } from '../types/express';

const accommodationController = {
  getAllAccommodations: async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
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
  getAccommodationById: async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
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
  createAccommodation: async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    try {
      const result = await accommodationModel.create(req.body);
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
  updateAccommodation: async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    try {
      const { id } = req.params;

      const result = await accommodationModel.update(id, req.body);

      if (!result.modifiedCount) {
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
  deleteAccommodation: async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    try {
      const { id } = req.params;

      const result = await accommodationModel.delete(id);

      if (!result.deletedCount) {
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
