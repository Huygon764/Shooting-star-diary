export interface CreateEntryDto {
  content: string;
  isPrivate?: boolean;
  userId?: string;
}

export interface UpdateEntryDto {
  content?: string;
  isPrivate?: boolean;
}

export interface GetEntriesQuery {
  userId?: string;
  limit?: string;
  page?: string;
}
