import type { ApiRequest } from '../core/api';
import type { Endpoint } from '../core/endpoint';
import { makeRealPath } from './make-url';
import type { InferClientIn } from './types';

export const buildApiRequest = <E extends Endpoint>(endpoint: E, input: InferClientIn<E>): ApiRequest => {
  const body: Record<string, any> = {};
  const params: Record<string, string> = {};
  const query: Record<string, string> = {};
  for (const key in input) {
    if (endpoint.request.params?.[key] != null) {
      const v = (input as any)[key];
      if (v !== undefined) {
        params[key] = String(v);
      }
      continue;
    }
    if (endpoint.request.body?.[key] != null) {
      const v = (input as any)[key];
      if (v !== undefined) {
        body[key] = v;
      }
      continue;
    }
    if (endpoint.request.query?.[key] != null) {
      const v = (input as any)[key];
      if (v !== undefined) {
        query[key] = String(v);
      }
      continue;
    }
  }
  return {
    method: endpoint.method,
    path: makeRealPath(endpoint.path, params),
    body: JSON.stringify(body) === '{}' ? null : body,
    query,
    cookies: {},
    params,
  };
};
