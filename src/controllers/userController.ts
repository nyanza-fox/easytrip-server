import userModel from "../models/userModel";
import { CustomResponse } from "../types/response";
import type { NextFunction, Request } from "express";
import { ObjectId } from "mongodb";
import { ProfileInput } from "../types/user";
interface CustomRequest extends Request {
  loginInfo?: {
    userId: ObjectId;
    email: string;
    role: string;
  };
}

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
  getProfile: async (
    req: CustomRequest,
    res: CustomResponse,
    next: NextFunction
  ) => {
    try {
      const email = req.loginInfo?.email as string;
      const users = await userModel.getUserByEmail(email);
      res.status(200).json({
        statusCode: 200,
        message: "Users retrieved successfully",
        data: users,
      });
    } catch (error) {
      next(error);
    }
  },
  updateProfile: async (
    req: CustomRequest,
    res: CustomResponse,
    next: NextFunction
  ) => {
    try {
      const email = req.loginInfo?.email as string;
      const body: ProfileInput = req.body;
      const users = await userModel.updateProfile(body, email);
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
