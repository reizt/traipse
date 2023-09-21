type ErrorKey = string;
type Code = number;
export type LogicErrorCodeDef = { [K in ErrorKey]: Code | LogicErrorCodeDef };

type KeyPath<T> = keyof {
  [K in keyof T & string as T[K] extends Code ? K : KeyPath<T[K]> extends ErrorKey ? `${K}.${KeyPath<T[K]>}` : never]: '';
};

export type LogicErrorKey<Def extends LogicErrorCodeDef> = KeyPath<Def>;

export class LogicError<Def extends LogicErrorCodeDef> extends Error {
  constructor(public readonly key: LogicErrorKey<Def>) {
    super(key.toString());
  }
}

export class LogicErrorBuilder<Def extends LogicErrorCodeDef> {
  private readonly IsLogicError = 'x-isTraipseLogicError';

  constructor(private readonly endpoint: Def) {}

  build(key: LogicErrorKey<Def>): LogicError<Def> {
    return new LogicError<Def>(key);
  }

  getStatusCode(key: LogicErrorKey<Def>): Code {
    if (typeof key !== 'string') throw new Error('key must be string');
    const keys = key.split('.');
    const lastKey = keys.pop() as keyof typeof this.endpoint;
    let status = this.endpoint[lastKey];
    for (const k of keys) {
      status = (status as LogicErrorCodeDef)[k] as any;
    }
    return (status as Code | undefined) ?? 500;
  }

  isLogicError(err: any): err is LogicError<Def> {
    return err[this.IsLogicError] === true;
  }

  serializeBody(key: LogicErrorKey<Def>): any {
    return { [this.IsLogicError]: true, errorKey: key };
  }

  deserializeBody(body: any): LogicErrorKey<Def> {
    return body.errorKey;
  }
}
