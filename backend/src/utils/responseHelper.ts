import type { Response } from 'express';
import type { ApiResponse, PaginationMeta, PaginatedResponse } from '../types/index.js';

export const sendSuccess = <T>(
  res: Response,
  statusCode: number,
  data?: T,
  message?: string
): Response => {
  const response: ApiResponse<T> = {
    success: true,
  };

  if (message) response.message = message;
  if (data !== undefined) response.data = data;

  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  errors?: string[]
): Response => {
  const response: ApiResponse = {
    success: false,
    message,
  };

  if (errors?.length) response.errors = errors;

  return res.status(statusCode).json(response);
};

export const sendPaginated = <T>(
  res: Response,
  data: T[],
  pagination: PaginationMeta,
  message?: string
): Response => {
  const response: PaginatedResponse<T> = {
    success: true,
    data,
    pagination,
  };

  if (message) response.message = message;

  return res.status(200).json(response);
};

// Helper to build pagination meta
export const buildPaginationMeta = (
  total: number,
  page: number,
  limit: number
): PaginationMeta => {
  return {
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  };
};
