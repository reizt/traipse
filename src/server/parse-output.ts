import type { ApiResponse } from '../core/api';
import type { Endpoint } from '../core/endpoint';

export const parseOutput = (output: any, endpoint: Endpoint): ApiResponse => {
  const cookies: Record<string, any> = {};
  const omitKeys: string[] = [];
  if (endpoint.response.cookies != null) {
    for (const key in endpoint.response.cookies) {
      cookies[key] = output[key];
      omitKeys.push(key);
    }
  }
  for (const key of omitKeys) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete output[key];
  }
  if (Object.keys(output).length === 0) output = undefined;
  return { body: output, status: endpoint.response.successCode, cookies };
};
