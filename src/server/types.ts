import type { z } from 'zod';
import type { Endpoint } from '../core/endpoint';

export type Logic<P extends Endpoint> = (input: InferServerIn<P>) => Promise<InferServerOut<P>>;

type NullGuardInfer<T, F> = T extends Record<string, z.ZodTypeAny> ? { [K in keyof T]: z.infer<T[K]> } : F;

type ReqBody<T extends Endpoint> = T['request']['body'];
type ReqQuery<T extends Endpoint> = T['request']['query'];
type ReqParams<T extends Endpoint> = T['request']['params'];
type ReqCookies<T extends Endpoint> = T['request']['cookies'];
export type InferServerIn<T extends Endpoint> = NullGuardInfer<ReqBody<T>, {}> &
  NullGuardInfer<ReqQuery<T>, {}> &
  NullGuardInfer<ReqParams<T>, {}> &
  NullGuardInfer<ReqCookies<T>, {}>;

type ResBody<T extends Endpoint> = T['response']['body'];
type ResCookies<T extends Endpoint> = T['response']['cookies'];
export type InferServerOut<T extends Endpoint> = ResBody<T> extends undefined
  ? ResCookies<T> extends undefined
    ? void
    : NullGuardInfer<ResCookies<T>, {}>
  : NullGuardInfer<ResBody<T>, {}>;
