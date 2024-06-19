import { NextFunction } from 'express';
import { OAuth2Client } from 'google-auth-library';

import { compareStr } from '../lib/bcrypt';
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
          image: user.profile.image,
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
          image: user?.profile.image,
        },
      });
    } catch (err) {
      next(err);
    }
  },
  facebook: async (_req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    try {
      const url = `https://www.facebook.com/v13.0/dialog/oauth?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${process.env.FACEBOOK_REDIRECT_URI}&scope=email`;
      res.redirect(url);
    } catch (err) {
      next(err);
    }
  },
  facebookCallback: async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    try {
      const { code } = req.query;

      if (!code) {
        return next({
          statusCode: 400,
          name: 'Bad Request',
          message: 'Code is required',
        });
      }

      const response = await fetch(
        `https://graph.facebook.com/v13.0/oauth/access_token?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${process.env.FACEBOOK_REDIRECT_URI}&client_secret=${process.env.FACEBOOK_APP_SECRET}&code=${code}`
      );
      const data = await response.json();

      const userResponse = await fetch(
        `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${data.access_token}`
      );
      const user = await userResponse.json();

      let userDoc = await userModel.findByEmail(user.email);

      if (!userDoc) {
        const result = await userModel.create({
          email: user.email,
          password: Math.random().toString(36).substring(7),
          profile: {
            firstName: user.name.split(' ')[0],
            lastName: user.name.slice(user.name.indexOf(' ') + 1),
            image: user.picture.data.url,
          },
        });

        userDoc = await userModel.findById(result.insertedId.toHexString());
      }

      const token = generateToken({
        id: userDoc?._id,
        email: userDoc?.email,
        role: userDoc?.role,
      });

      res.redirect(
        `${process.env.CLIENT_URL}/callback/auth?token=${token}&role=${userDoc?.role}&image=${userDoc?.profile.image}`
      );
    } catch (err) {
      next(err);
    }
  },
};

export default authController;
