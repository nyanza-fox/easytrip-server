import transportationModel from '../models/transportationModel';

import type { NextFunction, Request } from 'express';
import type { CustomResponse } from '../types/response';
import type { TransportationInput } from '../types/transportation';

const transportationController = {
  getAllTransportations: async (_req: Request, res: CustomResponse, next: NextFunction) => {
    try {
      const transportations = await transportationModel.findAll();

      res.status(200).json({
        statusCode: 200,
        message: 'Transportations retrieved successfully',
        data: transportations,
      });
    } catch (error) {
      next(error);
    }
  },
  getTransportationById: async (req: Request, res: CustomResponse, next: NextFunction) => {
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
  createTransportation: async (req: Request, res: CustomResponse, next: NextFunction) => {
    try {
      const payload: TransportationInput = req.body;
      const result = await transportationModel.create(payload);

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
  updateTransportation: async (req: Request, res: CustomResponse, next: NextFunction) => {
    try {
      const { id } = req.params;

      const payload: TransportationInput = req.body;
      const result = await transportationModel.update(id, payload);

      if (result.modifiedCount === 0) {
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
  deleteTransportation: async (req: Request, res: CustomResponse, next: NextFunction) => {
    try {
      const { id } = req.params;

      const result = await transportationModel.delete(id);

      if (result.deletedCount === 0) {
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
