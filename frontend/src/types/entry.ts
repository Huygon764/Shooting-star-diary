import type { EntryPopulated } from './models.js';

// Create entry
export interface CreateEntryRequest {
  content: string;
  isPrivate?: boolean;
}

export interface CreateEntryResponse {
  success: boolean;
  message?: string;
  data?: EntryPopulated;
}
