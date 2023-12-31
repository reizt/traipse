import type { Endpoint } from '../core/endpoint';
import { LogicError, LogicErrorBuilder, type LogicErrorCodeDef } from '../core/error';
import { Failure, Success, type Result } from '../core/result';
import { buildApiRequest } from './build-api-request';
import { FetcherError, type Fetcher, type InferClientIn, type InferClientOut } from './types';
import { unpackApiResponse } from './unpack-api-response';

export class TraipseClient<FetcherOptions, ErrorDef extends LogicErrorCodeDef> {
  public readonly baseUrl: string;
  public readonly fetcher: Fetcher<FetcherOptions>;
  private readonly errorBuilder: LogicErrorBuilder<ErrorDef>;
  private readonly fetcherDefaultOptions?: FetcherOptions;

  constructor(initArgs: { baseUrl: string; fetcher: Fetcher<FetcherOptions>; logicErrorCodeDef: ErrorDef; fetcherDefaultOptions?: FetcherOptions }) {
    this.fetcher = initArgs.fetcher;
    this.baseUrl = initArgs.baseUrl;
    this.errorBuilder = new LogicErrorBuilder(initArgs.logicErrorCodeDef);
    this.fetcherDefaultOptions = initArgs.fetcherDefaultOptions;
  }

  async request<EP extends Endpoint>(endpoint: EP, input: InferClientIn<EP>, options?: FetcherOptions): Promise<InferClientOut<EP>> {
    try {
      if (this.fetcherDefaultOptions != null) {
        options = { ...this.fetcherDefaultOptions, ...options };
      }
      const request = buildApiRequest(endpoint, input);
      const response = await this.fetcher(this.baseUrl, request, options);
      const output = unpackApiResponse(endpoint, response);
      return output;
    } catch (err) {
      if (err instanceof FetcherError && this.errorBuilder.isLogicError(err.body)) {
        const errorKey = this.errorBuilder.deserializeBody(err.body);
        throw this.errorBuilder.build(errorKey);
      }
      throw err;
    }
  }

  async safeRequest<EP extends Endpoint>(
    endpoint: EP,
    input: InferClientIn<EP>,
    options?: FetcherOptions,
  ): Promise<Result<InferClientOut<EP>, LogicError<ErrorDef>>> {
    try {
      const output = await this.request(endpoint, input, options);
      return new Success(output);
    } catch (err) {
      if (err instanceof LogicError) {
        return new Failure(err);
      }
      throw err;
    }
  }
}
