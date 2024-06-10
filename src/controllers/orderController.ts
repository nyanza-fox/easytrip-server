import { Request, Response } from 'express';

const orderController = {
  getHello: async (_req: Request, res: Response) => {
    res.status(200).json({ message: 'Hello, World!' });
  },
};

export default orderController;
