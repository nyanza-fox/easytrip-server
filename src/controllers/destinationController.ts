import type { Request } from 'express';
import type { CustomResponse } from '../types/response';
import destinationModel from '../models/destinationModel';

const destinationController = {
  getHello: async (_req: Request, res: CustomResponse) => {
    res.status(200).json({
      statusCode: 200,
      message: 'Hello, World!',
    });
  },

  getAllDestinations: async (_req: Request, res: CustomResponse) => {
    const response = await destinationModel.findAll();
    res.status(200).json({
      statusCode: 200,
      message: 'Data fetch successfully',
      data: response,
    });
  },

  getDestinationById: async (req: Request, res: CustomResponse) => {
    const { id } = req.params;
    const response = await destinationModel.findById(id);
    res.status(200).json({
      statusCode: 200,
      message: 'Data fetch successfully',
      data: response,
    });
  },
};

export default destinationController;
