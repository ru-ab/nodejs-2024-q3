import { WebSocketServer } from 'ws';

type Fn<T> = (data: T) => void;
type Handlers<T> = { [K in keyof T]: Fn<T[K]> | undefined };

export interface Message<T> {
  id: number;
  type: keyof T;
  data: unknown;
}

export class Router<T> {
  private handlers: Handlers<T>;
  private wss: WebSocketServer;

  constructor() {
    this.handlers = {} as Handlers<T>;
    this.wss = new WebSocketServer({ port: 3000 });

    this.wss.on('connection', (ws) => {
      ws.on('error', console.error);

      ws.on('message', (data) => {
        let message: Message<T> = JSON.parse(data.toString());
        message = { ...message, data: JSON.parse(message.data as string) };
        this.handleMessage(message.type, message as T[keyof T]);
      });
    });
  }

  public use<K extends keyof T>(type: K, handler: Fn<T[K]>) {
    this.handlers[type] = handler;
  }

  private handleMessage<K extends keyof T>(type: K, data: T[K]) {
    this.handlers[type]?.(data);
  }
}
