import type { ApiRequest } from '../core/api';
import type { Endpoint } from '../core/endpoint';
import { zodCoerce } from './zod-coerce';

export const parseRequest = (request: ApiRequest, endpoint: Endpoint): any => {
  const input: Record<string, any> = {};

  if (request.body != null) {
    for (const key in endpoint.request.body) {
      if (request.body[key] == null) continue;
      const schema = endpoint.request.body[key];
      if (schema == null) continue;
      const value = zodCoerce(request.body[key], schema);
      input[key] = schema.parse(value);
    }
  }

  for (const key in endpoint.request.params) {
    if (request.params[key] == null) continue;
    const schema = endpoint.request.params[key];
    if (schema == null) continue;
    const value = zodCoerce(request.params[key], schema);
    input[key] = schema.parse(value);
  }

  for (const key in endpoint.request.query) {
    if (request.query[key] == null) continue;
    const schema = endpoint.request.query[key];
    if (schema == null) continue;
    const value = zodCoerce(request.query[key], schema);
    input[key] = schema.parse(value);
  }

  for (const key in endpoint.request.cookies) {
    if (request.cookies[key] == null) continue;
    const schema = endpoint.request.cookies[key];
    if (schema == null) continue;
    const value = zodCoerce(request.cookies[key], schema);
    input[key] = schema.parse(value);
  }

  return input;
};
