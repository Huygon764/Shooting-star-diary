import type { IUserProfile } from '../models/user.model.js';

export interface RegisterDto {
  username: string;
  password: string;
  displayName?: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface UpdateProfileDto {
  displayName?: string;
  profile?: Partial<IUserProfile>;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface GetUsersQuery {
  page?: string;
  limit?: string;
  search?: string;
}
