import { WebSocketServer } from 'ws';

export type SendResponse = (data: unknown) => void;
type Handler<T> = (data: T, send: SendResponse) => void;
type Handlers<T> = { [K in keyof T]: Handler<T[K]> | undefined };

export interface Message<T = unknown> {
  id: number;
  type: keyof T;
  data: unknown;
}

export class MessageServer<T> {
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
        this.handleMessage(message.type, message as T[keyof T], (res) =>
          ws.send(
            JSON.stringify({
              ...data,
              data: JSON.stringify((res as Message).data),
            })
          )
        );
      });
    });
  }

  public use<K extends keyof T>(type: K, handler: Handler<T[K]>) {
    this.handlers[type] = handler;
  }

  private handleMessage<K extends keyof T>(
    type: K,
    data: T[K],
    send: SendResponse
  ) {
    this.handlers[type]?.(data, send);
  }
}
