// User model
export interface UserProfile {
  bio: string;
  favoriteEmoji: string;
  theme: 'default' | 'dark' | 'light' | 'cosmic';
}

export interface User {
  _id: string;
  username: string;
  displayName: string;
  avatar: string | null;
  profile: UserProfile;
  isActive: boolean;
  isAdmin: boolean;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}

// Entry model
export interface Entry {
  _id: string;
  content: string;
  date: string;
  id: number;
  userId: string | User | null;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

// Entry with populated user
export interface EntryPopulated extends Omit<Entry, 'userId'> {
  userId: Pick<User, '_id' | 'username' | 'displayName' | 'avatar'> | null;
}
