import { IncomingMessage } from 'node:http';

export class Request {
  private request: IncomingMessage;

  private bodyData: object;

  constructor(request: IncomingMessage) {
    this.request = request;
    this.bodyData = {};
  }

  public async parseBody(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let rawBody: string = '';

      this.request.on('data', (chunk) => {
        rawBody += chunk;
      });

      this.request.on('error', (error) => reject(error));

      this.request.on('end', async () => {
        if (!rawBody) {
          resolve(true);
          return;
        }

        try {
          this.bodyData = JSON.parse(rawBody);
          resolve(true);
        } catch (error) {
          resolve(false);
        }
      });
    });
  }

  public get body() {
    return this.bodyData;
  }

  public get method() {
    return this.request.method ?? '';
  }

  public get url() {
    return this.request.url ?? '';
  }
}
