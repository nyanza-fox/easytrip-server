import { NextFunction } from 'express';

import guideModel from '../models/guideModel';

import type { CustomRequest, CustomResponse } from '../types/express';

const guideController = {
  getAllGuides: async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    try {
      const { search, page, limit } = req.query;

      const { data, pagination } = await guideModel.findAllWithPagination(
        search?.toString() || '',
        Number(page || 1),
        Number(limit || 10)
      );

      res.status(200).json({
        statusCode: 200,
        message: 'Guides retrieved successfully',
        data,
        pagination,
      });
    } catch (error) {
      next(error);
    }
  },
  getGuideById: async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
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
  createGuide: async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    try {
      const result = await guideModel.create(req.body);

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
  updateGuide: async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    try {
      const { id } = req.params;

      const result = await guideModel.update(id, req.body);

      if (!result.modifiedCount) {
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
  deleteGuide: async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    try {
      const { id } = req.params;

      const result = await guideModel.delete(id);

      if (!result.deletedCount) {
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
