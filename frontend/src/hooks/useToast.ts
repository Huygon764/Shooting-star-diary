import { toast } from 'vue3-toastify';
import type { ToastType } from '@/config';

export function useToast() {
  const showToast = (message: string, type: ToastType = 'info') => {
    const options = {
      position: 'top-center' as const,
      autoClose: 3000,
      theme: 'colored' as const,
    };

    switch (type) {
      case 'success':
        toast.success(message, options);
        break;
      case 'error':
        toast.error(message, options);
        break;
      case 'warning':
        toast.warning(message, options);
        break;
      case 'info':
      default:
        toast.info(message, options);
        break;
    }
  };

  const clearAllToasts = () => {
    toast.clearAll();
  };

  return {
    showToast,
    clearAllToasts,
  };
}
