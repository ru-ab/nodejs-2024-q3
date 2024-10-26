import { WebSocketServer } from 'ws';

export type SendResponse = (data: unknown) => void;
type Handler<T, S> = (data: T, ctx: Context<S>) => void;
type Handlers<T, S> = { [K in keyof T]: Handler<T[K], S> | undefined };

export interface Message<T = unknown> {
  id: number;
  type: keyof T;
  data: unknown;
}

export type Context<S> = {
  session: S;
  reply: SendResponse;
};

export class MessageServer<T, S> {
  private handlers: Handlers<T, S>;
  private wss: WebSocketServer;

  constructor() {
    this.handlers = {} as Handlers<T, S>;
    this.wss = new WebSocketServer({ port: 3000 });

    this.wss.on('connection', (ws) => {
      const ctx: Context<S> = {
        session: {} as S,
        reply: (res) => ws.send(this.stringifyData(res as Message)),
      };

      ws.on('error', console.error);

      ws.on('message', (data) => {
        try {
          const messageData = this.parseData(data.toString());
          this.handleMessage(messageData.type, messageData as T[keyof T], ctx);
        } catch (error) {
          console.error(error, data.toString());
        }
      });
    });
  }

  public use<K extends keyof T>(type: K, handler: Handler<T[K], S>) {
    this.handlers[type] = handler;
  }

  private handleMessage<K extends keyof T>(
    type: K,
    data: T[K],
    ctx: Context<S>
  ) {
    this.handlers[type]?.(data, ctx);
  }

  private parseData(data: string): Message<T> {
    let message: Message<T> = JSON.parse(data);
    message = {
      ...message,
      data: !!message.data ? JSON.parse(message.data as string) : '',
    };
    return message;
  }

  private stringifyData(data: Message): string {
    return JSON.stringify({
      ...(data as Message),
      data: JSON.stringify((data as Message).data),
    });
  }
}
