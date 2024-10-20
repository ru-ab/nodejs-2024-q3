import { ServerResponse } from 'node:http';

export class Response {
  private response: ServerResponse;

  constructor(response: ServerResponse) {
    this.response = response;
  }

  public status(code: number) {
    this.response.statusCode = code;
    return this;
  }

  public json(data: unknown) {
    this.response.setHeader('Content-Type', 'application/json');
    this.response.end(JSON.stringify(data));
  }
}
