import type { z } from 'zod';
import type { ApiResponse } from '../core/api';
import type { Endpoint } from '../core/endpoint';
import type { InferClientOut } from './types';

export const unpackApiResponse = <E extends Endpoint>(endpoint: E, response: ApiResponse): InferClientOut<E> => {
  if (endpoint.response.body == null) {
    return undefined as unknown as InferClientOut<E>;
  }
  return coerce(response.body, endpoint.response.body);
};

const coerce = <T>(value: unknown, type: z.ZodType<T>): T => {
  const result = type.safeParse(value);
  if (!result.success) {
    throw new Error(`Failed to coerce value: ${result.error.message}`);
  }
  return result.data;
};
