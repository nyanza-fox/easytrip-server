import { NextFunction } from 'express';
import { OAuth2Client } from 'google-auth-library';

import { compareStr, hashStr } from '../lib/bcrypt';
import { generateToken } from '../lib/jwt';
import userModel from '../models/userModel';

import type { CustomRequest, CustomResponse } from '../types/express';
import type { UserInput } from '../types/user';

const authController = {
  register: async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    try {
      const payload: UserInput = req.body;

      const isEmailExists = !!(await userModel.findByEmail(payload.email));

      if (isEmailExists) {
        return next({
          statusCode: 400,
          name: 'Bad Request',
          message: 'Email already exists',
        });
      }

      payload.password = await hashStr(payload.password);

      const result = await userModel.create(payload);
      const user = await userModel.findById(result.insertedId.toHexString());

      res.status(201).json({
        statusCode: 201,
        message: 'Registered successfully',
        data: user,
      });
    } catch (err) {
      next(err);
    }
  },
  login: async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    try {
      const payload: UserInput = req.body;

      const user = await userModel.findByEmail(payload.email);

      if (!user || !(await compareStr(payload.password, user.password))) {
        return next({
          statusCode: 401,
          name: 'Unauthorized',
          message: 'Invalid email or password',
        });
      }

      const token = generateToken({
        id: user._id,
        email: user.email,
        role: user.role,
      });

      res.status(200).json({
        statusCode: 200,
        message: 'Logged in successfully',
        data: {
          token,
          role: user.role,
        },
      });
    } catch (err) {
      next(err);
    }
  },
  google: async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    try {
      const googleToken = req.headers.token;

      if (!googleToken) {
        return next({
          statusCode: 400,
          name: 'Bad Request',
          message: 'Token is required',
        });
      }

      const client = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
      );

      const ticket = await client.verifyIdToken({
        idToken: googleToken.toString(),
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      if (!payload) {
        return next({
          statusCode: 401,
          name: 'Unauthorized',
          message: 'Invalid token',
        });
      }

      let user = await userModel.findByEmail(payload.email || '');

      if (!user) {
        const result = await userModel.create({
          email: payload.email || '',
          password: Math.random().toString(36).substring(7),
          profile: {
            firstName: payload.name?.split(' ')[0] || '',
            lastName: payload.name?.slice(payload.name.indexOf(' ') + 1) || '',
            image: payload.picture || '',
          },
        });

        user = await userModel.findById(result.insertedId.toHexString());
      }

      const token = generateToken({
        id: user?._id,
        email: user?.email,
        role: user?.role,
      });

      res.status(200).json({
        statusCode: 200,
        message: 'Logged in successfully',
        data: {
          token,
          role: user?.role,
        },
      });
    } catch (err) {
      next(err);
    }
  },
};

export default authController;
