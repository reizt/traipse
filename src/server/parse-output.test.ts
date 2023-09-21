import { z } from 'zod';
import type { Endpoint } from '../core/endpoint';
import { parseOutput } from './parse-output';

describe(parseOutput.name, () => {
  it('should parse output', () => {
    const endpoint: Endpoint = {
      method: 'get',
      path: '/test',
      request: {},
      response: {
        successCode: 200,
        body: z.object({
          foo: z.string(),
        }),
        cookies: {
          bar: z.string(),
        },
      },
    };
    const output = {
      foo: 'foo',
      bar: 'bar',
    };
    const result = parseOutput(output, endpoint);
    expect(result).toEqual({
      body: {
        foo: 'foo',
      },
      status: 200,
      cookies: {
        bar: 'bar',
      },
    });
  });
});
