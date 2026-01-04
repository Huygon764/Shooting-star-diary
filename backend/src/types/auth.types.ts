import type { Request } from 'express';
import type { IUserDocument } from './models/user.model.js';

// JWT Payload
export interface JwtPayload {
  userId: string;
  username: string;
  iat?: number;
  exp?: number;
}

// Extended Express Request
export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
  userDoc: IUserDocument;
}

export interface OptionalAuthRequest extends Request {
  user?: JwtPayload;
  userDoc?: IUserDocument;
}
