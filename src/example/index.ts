import { z } from 'zod';
import { TraipseClient, TraipseServer, fetchFetcher, type ApiRequest, type Endpoint, type Logic, type LogicErrorCodeDef } from '../..';

const sync = <T>(fn: () => Promise<T>) => {
  fn().catch((err) => {
    throw err;
  });
};

export const endpoint = {
  method: 'post',
  path: '/users/{id}',
  request: {
    cookies: {
      token: z.string(),
    },
    params: {
      id: z.string(),
    },
    query: {
      q: z.string().optional(),
    },
    body: {
      name: z.string(),
      age: z.number().int().nonnegative(),
    },
  },
  response: {
    successCode: 200,
    body: z.object({
      id: z.string(),
      name: z.string(),
      age: z.number().int().nonnegative(),
    }),
  },
} satisfies Endpoint;

const errorDefs = {
  Auth: {
    InvalidPassword: 422,
  },
} satisfies LogicErrorCodeDef;

const logic: Logic<typeof endpoint> = async (input) => {
  return {
    id: 'xxx',
    name: input.name,
  };
};

const server = new TraipseServer({
  logicErrorCodeDef: errorDefs,
});

const req: ApiRequest = {
  method: 'post',
  path: '/users/123',
  cookies: {
    token: 'xxx',
  },
  params: {
    id: '123',
  },
  query: {
    q: 'test',
  },
  body: {
    name: 'John',
    age: 20,
  },
};

sync(async () => {
  const response = await server.handle(req, endpoint, logic);
  console.log(response);
});

const client = new TraipseClient({
  baseUrl: 'http://localhost:3000',
  fetcher: fetchFetcher,
  logicErrorCodeDef: errorDefs,
});

sync(async () => {
  const result = await client.safeRequest(endpoint, {
    id: '123',
    name: 'John',
    age: 20,
    q: 'test',
  });

  if (result.isSuccess()) {
    console.log(result.value);
  } else {
    console.log(result.error.key);
  }
});
