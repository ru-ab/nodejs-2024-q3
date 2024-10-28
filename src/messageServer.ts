import WebSocket, { WebSocketServer } from 'ws';
import Observer from './observer';
import { User } from './types/user.types';
import { parseData } from './utils/parseData';
import { stringifyData } from './utils/stringifyData';

export type SendMessage = (message: unknown) => void;
export type SendMessageTo = (userId: number, message: unknown) => void;
type Handler<T, S> = (data: T, ctx: Context<S>) => void;
type Handlers<T, S> = { [K in keyof T]: Handler<T[K], S> | undefined };

export interface Message<T = unknown> {
  id: number;
  type: keyof T;
  data: unknown;
}

export type Context<S> = {
  session: S;
  broadcast: SendMessage;
  reply: SendMessage;
  sendTo: SendMessageTo;
  registerConnection: (user: User) => boolean;
};

type Connection = {
  user: User;
  ws: WebSocket;
};

type EventTypes<S> = {
  userDisconnected: { user: User; ctx: Context<S> };
};

export class MessageServer<T, S> extends Observer<EventTypes<S>> {
  private handlers: Handlers<T, S>;

  private wss: WebSocketServer;

  private connections: Connection[];

  constructor(port: number) {
    super();
    this.connections = [];
    this.handlers = {} as Handlers<T, S>;
    this.wss = new WebSocketServer({ port });
    this.wss.on('connection', (ws) => this.handleConnection(ws));

    console.log(`Web Socket Server started on port: ${port}`);
  }

  public use<K extends keyof T>(type: K, handler: Handler<T[K], S>) {
    this.handlers[type] = handler;
  }

  public async terminate() {
    this.wss.close();
    this.wss.clients.forEach((socket) => {
      socket.close();
    });

    return this.waitForConnectionsToClose();
  }

  private waitForConnectionsToClose(): Promise<void> {
    return new Promise((resolve) => {
      if (this.wss.clients.size === 0) {
        resolve();
      } else {
        const interval = setInterval(() => {
          if (this.wss.clients.size === 0) {
            clearInterval(interval);
            resolve();
          }
        }, 1000);
      }
    });
  }

  private handleConnection(ws: WebSocket): void {
    console.log('New connection established.');

    const ctx: Context<S> = this.createContext(ws);

    ws.on('error', console.error);

    ws.on('message', (data) => this.handleIncomingMessage(data, ctx));

    ws.on('close', () => this.handleConnectionClose(ws));
  }

  private createContext(ws: WebSocket): Context<S> {
    return {
      session: {} as S,
      registerConnection: (user) => {
        const connection = this.connections.find(
          (connection) => connection.user.index === user.index
        );
        if (connection) {
          console.log(
            `Connection with userId=${connection.user.index} already exists.`
          );
          return false;
        }
        this.connections.push({ user, ws });
        return true;
      },
      broadcast: (message) =>
        this.connections.forEach((connection) =>
          connection.ws.send(stringifyData(message as Message))
        ),
      sendTo: (userId, message) => {
        const receiver = this.connections.find(
          (connection) => connection.user.index === userId
        );
        if (receiver) {
          receiver.ws.send(stringifyData(message as Message));
        }
      },
      reply: (message) => ws.send(stringifyData(message as Message)),
    };
  }

  private handleIncomingMessage(data: WebSocket.RawData, ctx: Context<S>) {
    try {
      const messageData = parseData(data.toString());
      this.callHandler(messageData.type, messageData as T[keyof T], ctx);
    } catch (error) {
      console.error(error, data.toString());
    }
  }

  private handleConnectionClose(ws: WebSocket) {
    const connection = this.connections.find(
      (connection) => connection.ws === ws
    );
    if (!connection) {
      console.log('Connection closed.');
      return;
    }

    this.dispatch('userDisconnected', {
      user: connection.user,
      ctx: this.createContext(ws),
    });

    console.log(
      `Connection ${connection.user.name}[${connection.user.index}] closed.`
    );
    this.connections = this.connections.filter(
      (connection) => connection.ws !== ws
    );
  }

  private callHandler<K extends keyof T>(type: K, data: T[K], ctx: Context<S>) {
    this.handlers[type]?.(data, ctx);
  }
}
