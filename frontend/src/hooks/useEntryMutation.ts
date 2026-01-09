import { useMutation } from '@tanstack/vue-query';
import { entryService } from '@/services';
import { useToast } from '@/hooks/useToast';
import { MESSAGES } from '@/config';
import type { CreateEntryRequest } from '@/types';

export function useCreateEntryMutation() {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (data: CreateEntryRequest) => entryService.create(data),
    onSuccess: (response) => {
      if (response.success) {
        showToast(MESSAGES.ENTRY.CREATED, 'success');
      } else {
        showToast(response.message || MESSAGES.ERROR.UNKNOWN, 'error');
      }
    },
    onError: () => {
      showToast(MESSAGES.ERROR.UNKNOWN, 'error');
    },
  });
}
