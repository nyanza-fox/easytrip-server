import type { NextFunction, Request } from "express";
import type { CustomResponse } from "../types/response";
import userModel from "../models/userModel";
import type { User, UserInput } from "../types/user";
import { hashStr } from "../lib/bcrypt";

const authController = {
  register: async (req: Request, res: CustomResponse, next: NextFunction) => {
    try {
      const payload: UserInput = req.body;
      const hasPassword = await hashStr(payload.password);
      const data = {
        email: payload.email,
        password: hasPassword,
        profile: {
          firstName: payload.profile.firstName,
          lastName: payload.profile.lastName,
          phoneNumber: payload.profile.phoneNumber,
          dateOfBirth: payload.profile.dateOfBirth,
          image: payload.profile.image,
        },
      };
      const users = await userModel.findAll();
      const existsEmail = users.some((el) => data.email === el.email);

      if (existsEmail) {
        throw { name: "Duplicate" };
      }

      await userModel.register(data);
      res.status(201).json({
        statusCode: 201,
        message: "Success",
      });
    } catch (err) {
      next(err);
    }
  },
  login: async (req: Request, res: CustomResponse, next: NextFunction) => {
    try {
      const payload: UserInput = req.body;
      await userModel.register(payload);
      res.status(201).json({
        statusCode: 201,
        message: "Success",
      });
    } catch (err) {
      next(err);
    }
  },
  google: async (req: Request, res: CustomResponse, next: NextFunction) => {
    try {
      const payload: UserInput = req.body;
      await userModel.register(payload);
      res.status(201).json({
        statusCode: 201,
        message: "Success",
      });
    } catch (err) {
      next(err);
    }
  },
};

export default authController;
