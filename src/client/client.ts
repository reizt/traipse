import type { Endpoint } from '../core/endpoint';
import { LogicError, LogicErrorBuilder, type LogicErrorCodeDef } from '../core/error';
import { Failure, Success, type Result } from '../core/result';
import { buildApiRequest } from './build-api-request';
import { EndpointError, type Fetcher, type InferClientIn, type InferClientOut } from './types';
import { unpackApiResponse } from './unpack-api-response';

export class TraipseClient<F extends Fetcher, ED extends LogicErrorCodeDef> {
  public readonly baseUrl: string;
  public readonly fetcher: F;
  private readonly errorBuilder: LogicErrorBuilder<ED>;

  constructor(initArgs: { baseUrl: string; fetcher: F; logicErrorCodeDef: ED }) {
    this.fetcher = initArgs.fetcher;
    this.baseUrl = initArgs.baseUrl;
    this.errorBuilder = new LogicErrorBuilder(initArgs.logicErrorCodeDef);
  }

  async request<EP extends Endpoint>(endpoint: EP, input: InferClientIn<EP>): Promise<InferClientOut<EP>> {
    try {
      const request = buildApiRequest(endpoint, input);
      const response = await this.fetcher(this.baseUrl, request);
      const output = unpackApiResponse(endpoint, response);
      return output;
    } catch (err) {
      if (err instanceof EndpointError && this.errorBuilder.isLogicError(err.body)) {
        const errorKey = this.errorBuilder.deserializeBody(err.body);
        throw this.errorBuilder.build(errorKey);
      }
      throw err;
    }
  }

  async safeRequest<EP extends Endpoint>(endpoint: EP, input: InferClientIn<EP>): Promise<Result<InferClientOut<EP>, LogicError<ED>>> {
    try {
      const output = await this.request(endpoint, input);
      return new Success(output);
    } catch (err) {
      if (err instanceof LogicError) {
        return new Failure(err);
      }
      throw err;
    }
  }
}
