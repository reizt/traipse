import { z } from 'zod';
import type { Endpoint } from '../core/endpoint';
import { buildApiRequest } from './build-api-request';
import type { InferClientIn } from './types';

const endpoint = {
  method: 'post',
  path: '/test/{paramsKey}',
  request: {
    params: { paramsKey: z.string() },
    query: { queryKey: z.number() },
    body: { bodyKey: z.string() },
  },
  response: {
    successCode: 200,
  },
} satisfies Endpoint;
const input: InferClientIn<typeof endpoint> = {
  paramsKey: 'paramsKey',
  queryKey: 123,
  bodyKey: 'bodyKey',
};

describe(buildApiRequest.name, () => {
  it('works', () => {
    const request = buildApiRequest(endpoint, input);
    expect(request).toEqual({
      method: 'post',
      path: '/test/paramsKey',
      body: { bodyKey: 'bodyKey' },
      query: { queryKey: '123' },
      cookies: {},
      params: { paramsKey: 'paramsKey' },
    });
  });
});
