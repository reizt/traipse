import type { z } from 'zod';
import type { ApiRequest, ApiResponse } from '../core/api';
import type { Endpoint } from '../core/endpoint';

type OptionalInfer<T, F> = T extends z.ZodTypeAny ? z.infer<T> : F;

export type InferClientIn<T extends Endpoint> = OptionalInfer<T['request']['body'], {}> &
  OptionalInfer<T['request']['query'], {}> &
  OptionalInfer<T['request']['params'], {}>;
export type InferClientOut<T extends Endpoint> = OptionalInfer<T['response']['body'], undefined>;

export type Fetcher<Options = never> = (baseUrl: string, req: ApiRequest, options?: Options) => Promise<ApiResponse>;
export type FetcherOptions<F extends Fetcher> = F extends Fetcher<infer O> ? O : never;

export class FetcherError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body: any,
  ) {
    super(message);
  }
}
