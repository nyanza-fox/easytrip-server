import userModel from "../models/userModel";

import type { NextFunction, Request } from "express";
import type { CustomResponse } from "../types/response";

const userController = {
  getAllUsers: async (
    _req: Request,
    res: CustomResponse,
    next: NextFunction
  ) => {
    try {
      const users = await userModel.findAll();

      res.status(200).json({
        statusCode: 200,
        message: "Users retrieved successfully",
        data: users,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default userController;
