import { Schema, model } from 'mongoose';
import type { IEntryDocument, IEntryModel } from '../types/index.js';

const entrySchema = new Schema<IEntryDocument, IEntryModel>(
  {
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
      maxlength: [2000, 'Content cannot exceed 2000 characters'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    id: {
      type: Number,
      default: () => Date.now(),
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    isPrivate: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
entrySchema.index({ createdAt: -1 });
entrySchema.index({ userId: 1 });

// Instance method: transform output
entrySchema.methods.toJSON = function (this: IEntryDocument) {
  const entry = this.toObject();
  return entry;
};

// Static method: find by user ID
entrySchema.statics.findByUserId = function (
  this: IEntryModel,
  userId: string
) {
  return this.find({ userId }).sort({ createdAt: -1 });
};

export const Entry = model<IEntryDocument, IEntryModel>('Entry', entrySchema);