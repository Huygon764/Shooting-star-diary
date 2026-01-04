export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(statusCode: number, message: string) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = true;

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

// Factory functions for common errors
export const badRequest = (message: string): AppError => {
  return new AppError(400, message);
};

export const unauthorized = (message: string = 'Unauthorized'): AppError => {
  return new AppError(401, message);
};

export const forbidden = (message: string = 'Forbidden'): AppError => {
  return new AppError(403, message);
};

export const notFound = (message: string = 'Not found'): AppError => {
  return new AppError(404, message);
};

export const internal = (message: string = 'Internal server error'): AppError => {
  return new AppError(500, message);
};
