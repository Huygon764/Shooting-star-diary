import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { env } from '../config/index.js';
import type { IUserDocument, IUserModel, IUserProfile } from '../types/index.js';

const userProfileSchema = new Schema<IUserProfile>(
  {
    bio: {
      type: String,
      maxlength: [200, 'Bio cannot exceed 200 characters'],
      default: '',
    },
    favoriteEmoji: {
      type: String,
      default: '🌟',
    },
    theme: {
      type: String,
      enum: ['default', 'dark', 'light', 'cosmic'],
      default: 'default',
    },
  },
  { _id: false }
);

const userSchema = new Schema<IUserDocument, IUserModel>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
      match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    displayName: {
      type: String,
      trim: true,
      maxlength: [50, 'Display name cannot exceed 50 characters'],
      default: function (this: IUserDocument) {
        return this.username;
      },
    },
    avatar: {
      type: String,
      default: null,
    },
    profile: {
      type: userProfileSchema,
      default: () => ({}),
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(env.bcryptRounds);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Instance method: compare password
userSchema.methods.comparePassword = async function (
  this: IUserDocument,
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Instance method: update last login
userSchema.methods.updateLastLogin = function (this: IUserDocument): Promise<IUserDocument> {
  this.lastLogin = new Date();
  return this.save({ validateBeforeSave: false });
};

// Instance method: transform output (remove sensitive data)
userSchema.methods.toJSON = function (this: IUserDocument) {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Static method: find by username
userSchema.statics.findByUsername = function (
  this: IUserModel,
  username: string
) {
  return this.findOne({ username });
};

export const User = model<IUserDocument, IUserModel>('User', userSchema);