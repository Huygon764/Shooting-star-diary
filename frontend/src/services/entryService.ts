import apiClient from '@/libs/axios';
import { ENDPOINTS } from '@/config';
import type { CreateEntryRequest, CreateEntryResponse } from '@/types';

export const entryService = {
  /**
   * Create new entry
   */
  create: async (data: CreateEntryRequest): Promise<CreateEntryResponse> => {
    return apiClient.post(ENDPOINTS.ENTRIES.CREATE, data);
  },
};
