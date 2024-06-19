import { NextFunction } from 'express';

import transportationModel from '../models/transportationModel';

import type { CustomRequest, CustomResponse } from '../types/express';

const transportationController = {
  getAllTransportations: async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    try {
      const { search, page, limit } = req.query;

      const { data, pagination } = await transportationModel.findAllWithPagination(
        search?.toString() || '',
        Number(page || 1),
        Number(limit || 10)
      );

      res.status(200).json({
        statusCode: 200,
        message: 'Transportations retrieved successfully',
        data,
        pagination,
      });
    } catch (error) {
      next(error);
    }
  },
  getTransportationById: async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    try {
      const { id } = req.params;

      const transportation = await transportationModel.findById(id);

      if (!transportation) {
        return next({
          statusCode: 404,
          name: 'Not Found',
          message: 'Transportation not found',
        });
      }

      res.status(200).json({
        statusCode: 200,
        message: 'Transportation retrieved successfully',
        data: transportation,
      });
    } catch (error) {
      next(error);
    }
  },
  createTransportation: async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    try {
      const result = await transportationModel.create(req.body);

      const transportation = await transportationModel.findById(result.insertedId.toHexString());

      res.status(201).json({
        statusCode: 201,
        message: 'Transportation created successfully',
        data: transportation,
      });
    } catch (error) {
      next(error);
    }
  },
  updateTransportation: async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    try {
      const { id } = req.params;

      const result = await transportationModel.update(id, req.body);

      if (!result.modifiedCount) {
        return next({
          statusCode: 404,
          name: 'Not Found',
          message: 'Transportation not found',
        });
      }

      const transportation = await transportationModel.findById(id);

      res.status(200).json({
        statusCode: 200,
        message: 'Transportation updated successfully',
        data: transportation,
      });
    } catch (error) {
      next(error);
    }
  },
  deleteTransportation: async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    try {
      const { id } = req.params;

      const result = await transportationModel.delete(id);

      if (!result.deletedCount) {
        return next({
          statusCode: 404,
          name: 'Not Found',
          message: 'Transportation not found',
        });
      }

      res.status(200).json({
        statusCode: 200,
        message: 'Transportation deleted successfully',
        data: null,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default transportationController;
