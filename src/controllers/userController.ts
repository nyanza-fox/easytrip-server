import type { Request } from 'express';
import type { CustomResponse } from '../types/response';

const userController = {
  getHello: async (_req: Request, res: CustomResponse) => {
    res.status(200).json({
      statusCode: 200,
      message: 'Hello, World!',
    });
  },
};

export default userController;
