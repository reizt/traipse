import type { z } from 'zod';

export type Endpoint = {
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
  path: string;
  request: {
    body?: { [K in string]: z.ZodTypeAny };
    query?: { [K in string]: z.ZodTypeAny };
    params?: { [K in string]: z.ZodTypeAny };
    cookies?: { [K in string]: z.ZodTypeAny };
  };
  response: {
    successCode: number;
    body?: z.ZodTypeAny;
    cookies?: { [K in string]: z.ZodTypeAny };
  };
};
