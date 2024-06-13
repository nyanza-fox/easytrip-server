import { NextFunction, Request } from "express";
import { verifyToken } from "../lib/jwt";
import { CustomResponse } from "../types/response";
import userModel from "../models/userModel";
import { ObjectId } from "mongodb";

interface CustomRequest extends Request {
  loginInfo?: {
    userId: ObjectId;
    email: string;
    role: string;
  };
}

type decoded = {
  id: ObjectId;
  email: string;
  role: string;
};

const isLogin = async (
  req: CustomRequest,
  _res: CustomResponse,
  next: NextFunction
) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) throw { name: "Unauthorized" };
    const token: string = authorization.split(" ")[1];
    const decoded = (await verifyToken(token)) as decoded;
    const user = await userModel.getUserByEmail(decoded.email);
    if (!user) throw { name: "Unauthorized" };
    req.loginInfo = {
      userId: user._id,
      email: user.email,
      role: user.role,
    };
    next();
  } catch (err) {
    next(err);
  }
};

export default isLogin;
