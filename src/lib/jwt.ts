import jwt from 'jsonwebtoken';

export const generateToken = (payload: object) => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'unsafe-key');
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'unsafe-key');
};
