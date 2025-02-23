import jwt from 'jsonwebtoken';
import { config } from '../config';

interface TokenPayload {
  id: string;
  email: string;
  isAdmin: boolean;
}

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '24h' });
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, config.jwtSecret) as TokenPayload;
}; 