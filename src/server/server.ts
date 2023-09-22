import type { ApiRequest, ApiResponse } from '../core/api';
import type { Endpoint } from '../core/endpoint';
import { LogicErrorBuilder, type LogicErrorCodeDef } from '../core/error';
import { parseOutput } from './parse-output';
import { parseRequest } from './parse-request';
import type { Logic } from './types';

export class TraipseServer<E extends LogicErrorCodeDef> {
  private readonly errorBuilder: LogicErrorBuilder<E>;

  constructor(initArgs: { logicErrorCodeDef: E }) {
    this.errorBuilder = new LogicErrorBuilder(initArgs.logicErrorCodeDef);
  }

  async handle<E extends Endpoint>(req: ApiRequest, endpoint: E, logic: Logic<E>): Promise<ApiResponse> {
    try {
      const input = parseRequest(req, endpoint);
      const output = await logic(input);
      const response = parseOutput(output, endpoint);
      return response;
    } catch (err) {
      if (this.errorBuilder.isLogicError(err)) {
        const status = this.errorBuilder.getStatusCode(err.key);
        const body = this.errorBuilder.serializeBody(err.key);
        return { status, body, cookies: {} };
      } else {
        throw err;
      }
    }
  }
}
