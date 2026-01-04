// Parse pagination query params with defaults
export const parsePagination = (
  page?: string,
  limit?: string,
  defaultLimit: number = 20
): { page: number; limit: number; skip: number } => {
  const parsedPage = Math.max(1, parseInt(page || '1', 10));
  const parsedLimit = Math.min(100, Math.max(1, parseInt(limit || String(defaultLimit), 10)));
  const skip = (parsedPage - 1) * parsedLimit;

  return {
    page: parsedPage,
    limit: parsedLimit,
    skip,
  };
};

// Format date to Vietnamese locale
export const formatDateVi = (date: Date): string => {
  return date.toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Sanitize string (trim and remove extra whitespace)
export const sanitizeString = (str: string): string => {
  return str.trim().replace(/\s+/g, ' ');
};
