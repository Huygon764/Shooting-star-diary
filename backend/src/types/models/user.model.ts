import type { Document, Model, Types } from 'mongoose';

// User profile subdocument
export interface IUserProfile {
  bio: string;
  favoriteEmoji: string;
  theme: 'default' | 'dark' | 'light' | 'cosmic';
}

// Base user interface (plain object)
export interface IUser {
  username: string;
  password: string;
  displayName: string;
  avatar: string | null;
  profile: IUserProfile;
  isActive: boolean;
  isAdmin: boolean;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// User document (with Mongoose methods)
export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId;
  comparePassword(candidatePassword: string): Promise<boolean>;
  updateLastLogin(): Promise<IUserDocument>;
}

// User model (with static methods)
export interface IUserModel extends Model<IUserDocument> {
  findByUsername(username: string): Promise<IUserDocument | null>;
}
