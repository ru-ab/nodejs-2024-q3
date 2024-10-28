import { WebSocket } from 'ws';
import { Message } from '../messageServer';
import { Ship } from '../types/game.types';
import {
  AddShipsRequest,
  AddUserToRoomRequest,
  CreateGameResponse,
  RandomAttackRequest,
  RegisterRequest,
  RegisterResponse,
  TurnResponse,
} from '../types/message.types';
import { User } from '../types/user.types';
import { parseData } from '../utils/parseData';
import { stringifyData } from '../utils/stringifyData';

export interface IBotService {
  addBotToRoom: (roomId: number) => Promise<User>;
}

type Bot = {
  status: 'idle' | 'game';
  playerId: number;
  gameId: number;
  user: User;
  ws: WebSocket;
};

export class BotService implements IBotService {
  private nextBotId: number = 1;

  private bots: Bot[] = [];

  async addBotToRoom(roomId: number): Promise<User> {
    return new Promise((resolve, reject) => {
      const idleBot = this.bots.find((bot) => bot.status === 'idle');
      if (idleBot) {
        const addUserToRoomMessage: AddUserToRoomRequest = {
          id: 0,
          type: 'add_user_to_room',
          data: {
            indexRoom: roomId,
          },
        };
        idleBot.ws.send(stringifyData(addUserToRoomMessage as Message));
        resolve(idleBot.user);
        return;
      }

      const ws = new WebSocket('ws://localhost:3000');
      const bot: Bot = {
        status: 'idle',
        playerId: -1,
        gameId: -1,
        user: {
          name: `Bot${this.nextBotId++}`,
          password: '',
          index: -1,
        },
        ws,
      };

      ws.on('open', () => {
        console.log(`${bot.user.name} connected to the server.`);

        const registerMessage: RegisterRequest = {
          id: 0,
          type: 'reg',
          data: { name: bot.user.name, password: '' },
        };

        ws.send(stringifyData(registerMessage as Message));
      });

      ws.on('message', (data) => {
        const message = parseData(data.toString());
        if (message.type === 'reg') {
          if (!(message as RegisterResponse).data.error) {
            const addUserToRoomMessage: AddUserToRoomRequest = {
              id: 0,
              type: 'add_user_to_room',
              data: {
                indexRoom: roomId,
              },
            };
            ws.send(stringifyData(addUserToRoomMessage as Message));
            resolve(bot.user);
          } else {
            reject();
          }
        } else {
          this.handleMessage(message, bot);
        }
      });

      ws.on('error', console.error);

      ws.on('close', () => console.log(`${bot.user.name} disconnected.`));

      this.bots.push(bot);
    });
  }

  private handleMessage(message: Message, bot: Bot) {
    switch (message.type) {
      case 'create_game': {
        const createGameMessage = message as CreateGameResponse;

        bot.status = 'game';
        bot.gameId = createGameMessage.data.idGame;
        bot.playerId = createGameMessage.data.idPlayer;

        const addShipsMessage: AddShipsRequest = {
          id: 0,
          type: 'add_ships',
          data: {
            gameId: createGameMessage.data.idGame,
            indexPlayer: createGameMessage.data.idPlayer,
            ships: this.generateShips(),
          },
        };
        bot.ws.send(stringifyData(addShipsMessage as Message));
        break;
      }
      case 'turn': {
        const turnMessage = message as TurnResponse;
        if (turnMessage.data.currentPlayer === bot.playerId) {
          setTimeout(() => {
            const randomAttackRequest: RandomAttackRequest = {
              id: 0,
              type: 'randomAttack',
              data: {
                gameId: bot.gameId,
                indexPlayer: bot.playerId,
              },
            };
            bot.ws.send(stringifyData(randomAttackRequest as Message));
          }, 1000);
        }
        break;
      }
      case 'finish': {
        bot.status = 'idle';
        break;
      }
      case 'diconnect': {
        bot.status = 'idle';
        break;
      }
    }
  }

  private generateShips(): Ship[] {
    const shipLengths = {
      small: 1,
      medium: 2,
      large: 3,
      huge: 4,
    };

    const shipsVariants: ('huge' | 'large' | 'medium' | 'small')[] = [
      'huge',
      'large',
      'large',
      'medium',
      'medium',
      'medium',
      'small',
      'small',
      'small',
      'small',
    ];

    const ships: Ship[] = [];
    const field = Array.from({ length: 10 }, () => Array(10).fill(false));

    function canPlaceShip(
      x: number,
      y: number,
      length: number,
      direction: boolean
    ) {
      for (let i = 0; i < length; i++) {
        const newX = x + (direction ? 0 : i);
        const newY = y + (direction ? i : 0);

        if (newX >= 10 || newY >= 10 || field[newX][newY]) {
          return false;
        }

        for (let x = -1; x <= 1; x++) {
          for (let y = -1; y <= 1; y++) {
            const adjX = newX + x;
            const adjY = newY + y;
            if (
              adjX >= 0 &&
              adjX < 10 &&
              adjY >= 0 &&
              adjY < 10 &&
              field[adjX][adjY]
            )
              return false;
          }
        }
      }
      return true;
    }

    for (const type of shipsVariants) {
      let placed = false;

      while (!placed) {
        const x = Math.floor(Math.random() * 10);
        const y = Math.floor(Math.random() * 10);
        const direction = Math.random() < 0.5;

        if (canPlaceShip(x, y, shipLengths[type], direction)) {
          for (let i = 0; i < shipLengths[type]; i++) {
            const newX = x + (direction ? 0 : i);
            const newY = y + (direction ? i : 0);
            field[newX][newY] = true;
          }

          ships.push({
            position: { x, y },
            direction,
            type,
            length: shipLengths[type],
          });
          placed = true;
        }
      }
    }

    return ships;
  }
}
