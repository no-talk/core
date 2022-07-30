export class Exception extends Error {
  readonly statusCode: number;
  readonly headers?: Record<string, string>;

  constructor(statusCode: number, message: string, headers?: Record<string, string>) {
    super(message);

    this.headers = headers;
    this.statusCode = statusCode;
  }
}
