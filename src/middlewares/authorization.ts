import { NextFunction, Request } from "express";
import { CustomResponse } from "../types/response";
import { ObjectId } from "mongodb";

interface CustomRequest extends Request {
  loginInfo?: {
    userId: ObjectId;
    email: string;
    role: string;
  };
}

const authorizationAdmin = async (
  req: CustomRequest,
  _res: CustomResponse,
  next: NextFunction
) => {
  try {
    const role = req.loginInfo?.role;
    if (role !== "admin") throw { name: "Forbidden" };
    next();
  } catch (err) {
    next(err);
  }
};

export default authorizationAdmin;
