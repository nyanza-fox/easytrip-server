import { Request, Response } from 'express';

const eventController = {
  getHello: async (_req: Request, res: Response) => {
    res.status(200).json({ message: 'Hello, World!' });
  },
};

export default eventController;
