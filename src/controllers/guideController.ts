import guideModel from '../models/guideModel';

import type { NextFunction, Request } from 'express';
import type { CustomResponse } from '../types/response';
import type { GuideInput } from '../types/guide';

const guideController = {
  getAllGuides: async (_req: Request, res: CustomResponse, next: NextFunction) => {
    try {
      const guides = await guideModel.findAll();

      res.status(200).json({
        statusCode: 200,
        message: 'Guides retrieved successfully',
        data: guides,
      });
    } catch (error) {
      next(error);
    }
  },
  getGuideById: async (req: Request, res: CustomResponse, next: NextFunction) => {
    try {
      const { id } = req.params;

      const guide = await guideModel.findById(id);

      if (!guide) {
        return next({
          statusCode: 404,
          name: 'Not Found',
          message: 'Guide not found',
        });
      }

      res.status(200).json({
        statusCode: 200,
        message: 'Guide retrieved successfully',
        data: guide,
      });
    } catch (error) {
      next(error);
    }
  },
  createGuide: async (req: Request, res: CustomResponse, next: NextFunction) => {
    try {
      const payload: GuideInput = req.body;
      const result = await guideModel.create(payload);

      const guide = await guideModel.findById(result.insertedId.toHexString());

      res.status(201).json({
        statusCode: 201,
        message: 'Guide created successfully',
        data: guide,
      });
    } catch (error) {
      next(error);
    }
  },
  updateGuide: async (req: Request, res: CustomResponse, next: NextFunction) => {
    try {
      const { id } = req.params;

      const payload: GuideInput = req.body;
      const result = await guideModel.update(id, payload);

      if (result.modifiedCount === 0) {
        return next({
          statusCode: 404,
          name: 'Not Found',
          message: 'Guide not found',
        });
      }

      const guide = await guideModel.findById(id);

      res.status(200).json({
        statusCode: 200,
        message: 'Guide updated successfully',
        data: guide,
      });
    } catch (error) {
      next(error);
    }
  },
  deleteGuide: async (req: Request, res: CustomResponse, next: NextFunction) => {
    try {
      const { id } = req.params;

      const result = await guideModel.delete(id);

      if (result.deletedCount === 0) {
        return next({
          statusCode: 404,
          name: 'Not Found',
          message: 'Guide not found',
        });
      }

      res.status(200).json({
        statusCode: 200,
        message: 'Guide deleted successfully',
        data: null,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default guideController;
