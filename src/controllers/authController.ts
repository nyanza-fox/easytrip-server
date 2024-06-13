import { OAuth2Client, TokenPayload } from 'google-auth-library';

import { compareStr, hashStr } from '../lib/bcrypt';
import { generateToken } from '../lib/jwt';
import userModel from '../models/userModel';

import type { NextFunction, Request } from 'express';
import type { UserInput } from '../types/user';
import type { CustomResponse } from '../types/response';

const authController = {
  register: async (req: Request, res: CustomResponse, next: NextFunction) => {
    try {
      const payload: UserInput = req.body;
      const hashPassword = await hashStr(payload.password);
      const data = {
        email: payload.email,
        password: hashPassword,
        role: 'user',
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
        throw { name: 'Duplicate' };
      }

      await userModel.register(data);
      res.status(201).json({
        statusCode: 201,
        message: 'Success',
      });
    } catch (err) {
      next(err);
    }
  },
  login: async (req: Request, res: CustomResponse, next: NextFunction) => {
    try {
      const payload: UserInput = req.body;
      const isUser = await userModel.getUserByEmail(payload.email);
      if (!isUser) {
        throw { name: 'LoginError' };
      }
      const compare = await compareStr(payload.password, isUser.password);

      if (!compare) {
        throw { name: 'LoginError' };
      }

      const result = {
        id: isUser._id,
        email: isUser.email,
        role: isUser.role,
      };

      const access_token = generateToken(result);
      res.status(201).json({
        statusCode: 201,
        message: 'Success',
        data: access_token,
      });
    } catch (err) {
      next(err);
    }
  },
  google: async (req: Request, res: CustomResponse, next: NextFunction) => {
    try {
      const token: string | string[] | undefined = req.headers.token;
      const client = new OAuth2Client();
      const ticket = await client.verifyIdToken({
        idToken: String(token),
        audience: process.env.GOOGLE_CLIENT_ID as string,
      });

      const payload = ticket.getPayload() as TokenPayload;
      payload.email;
      payload.name;

      const isUser = await userModel.getUserByEmail(String(payload.email));

      if (!isUser) {
        const data = {
          email: payload.email || '',
          password: Math.random().toString(36).substring(7),
          profile: {
            firstName: payload.name || '',
          },
        };
        const addUser = await userModel.register(data);
        if (addUser) {
          const user = await userModel.getUserByEmail(String(payload.email));
          const access_token = generateToken({
            id: user._id,
            email: user.email,
            role: user.role,
          });
          res.status(201).json({
            statusCode: 201,
            message: 'Success',
            data: access_token,
          });
        }
      }

      const access_token = generateToken({
        id: isUser._id,
        email: isUser.email,
        role: isUser.role,
      });
      res.status(201).json({
        statusCode: 201,
        message: 'Success',
        data: access_token,
      });
    } catch (err) {
      next(err);
    }
  },
};

export default authController;
