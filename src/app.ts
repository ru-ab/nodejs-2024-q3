import {
  createServer,
  IncomingMessage,
  Server,
  ServerResponse,
} from 'node:http';
import { Request } from './request';
import { Response } from './response';
import { ValidateError } from './errors/validateError';

type Method = 'GET' | 'POST';
type RequestHandler = (req: Request, res: Response) => Promise<void>;

export class App {
  private server: Server<typeof IncomingMessage, typeof ServerResponse>;
  private routes: {
    [key: string]: {
      [key: string]: RequestHandler;
    };
  };

  constructor() {
    this.server = createServer(this.handleRequest.bind(this));
    this.routes = {};
  }

  public get(path: string, handler: RequestHandler) {
    this.use('GET', path, handler);
  }

  public post(path: string, handler: RequestHandler) {
    this.use('POST', path, handler);
  }

  private use(method: Method, path: string, handler: RequestHandler) {
    if (!this.routes[path]) {
      this.routes[path] = {};
    }

    this.routes[path][method] = handler;
  }

  private async handleRequest(req: IncomingMessage, res: ServerResponse) {
    const request = new Request(req);
    const response = new Response(res);

    if (!(await request.parseBody())) {
      response.status(400).json({ message: 'Invalid JSON received' });
      return;
    }

    const method = request.method;
    const url = request.url;

    const routeHandlers = this.routes[url];
    if (routeHandlers && routeHandlers[method]) {
      try {
        await routeHandlers[method](request, response);
      } catch (error) {
        if (error instanceof ValidateError) {
          response.status(400).json({ message: error.message });
        } else {
          response.status(500).json({ message: 'Internal server error' });
        }
      }
    } else {
      response.status(404).json({ message: 'Page Not Found' });
    }
  }

  public listen(port: number) {
    this.server.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  }
}
