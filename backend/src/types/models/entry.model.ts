import type { Document, Model, Types, Query } from 'mongoose';
import type { IUserDocument } from './user.model.js';

// Base entry interface (plain object)
export interface IEntry {
  content: string;
  date: Date;
  userId: Types.ObjectId | null;
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Entry document (with Mongoose methods)
export interface IEntryDocument extends IEntry, Document {
  _id: Types.ObjectId;
}

// Populated entry (when userId is populated)
export interface IEntryPopulated extends Omit<IEntryDocument, 'userId'> {
  userId: Pick<IUserDocument, '_id' | 'username' | 'displayName' | 'avatar'> | null;
}

// Entry model (with static methods)
export interface IEntryModel extends Model<IEntryDocument> {
  findByUserId(userId: string | Types.ObjectId): Query<IEntryDocument[], IEntryDocument>;
}
