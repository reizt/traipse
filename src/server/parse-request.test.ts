import { z } from 'zod';
import type { ApiRequest } from '../core/api';
import type { Endpoint } from '../core/endpoint';
import { parseRequest } from './parse-request';

const request: ApiRequest = {
  method: 'get',
  cookies: {
    token: 'token',
  },
  params: {
    id: 'id',
  },
  path: '/',
  query: {
    page: '1',
  },
  body: {
    title: 'title',
    description: 'description',
  },
};
const endpoint: Endpoint = {
  method: 'get',
  path: '/',
  request: {
    body: {
      title: z.string(),
      description: z.string(),
    },
    params: {
      id: z.string(),
    },
    cookies: {
      token: z.string(),
    },
    query: {
      page: z.number(),
    },
  },
  response: {
    successCode: 200,
    body: z.object({}),
    cookies: {},
  },
};

describe(parseRequest.name, () => {
  it('works', () => {
    const input = parseRequest(request, endpoint);
    expect(input).toEqual({
      token: 'token',
      id: 'id',
      page: 1,
      title: 'title',
      description: 'description',
    });
  });
});
