import { makeRealPath, makeUrl } from '../make-url';
import { FetcherError, type Fetcher } from '../types';

export const fetchFetcher: Fetcher<RequestInit> = async (baseUrl, req, options) => {
  const path = makeRealPath(req.path, req.params);
  const url = makeUrl(baseUrl, path, req.query);

  const res = await fetch(url, {
    method: req.method.toUpperCase(),
    body: req.body == null ? null : JSON.stringify(req.body),
    ...options,
  });

  let json: any = null;
  try {
    json = await res.json();
  } catch {}

  if (!res.ok) {
    throw new FetcherError(res.statusText, res.status, json);
  }

  return {
    status: res.status,
    body: json,
    cookies: {},
  };
};
