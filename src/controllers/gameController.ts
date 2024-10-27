import { Context } from '../messageServer';
import { IGameService } from '../services/gameService';
import {
  AddShipsRequest,
  StartGameResponse,
  TurnResponse,
} from '../types/message.types';
import { Session } from '../types/session.types';

export interface IGameController {
  addShips: (req: AddShipsRequest, ctx: Context<Session>) => void;
}

export class GameController implements IGameController {
  constructor(private readonly gameService: IGameService) {}

  public addShips = (req: AddShipsRequest, ctx: Context<Session>): void => {
    const { gameId, indexPlayer, ships } = req.data;

    const game = this.gameService.addShips(gameId, indexPlayer, ships);
    if (!game) {
      return;
    }

    console.log(
      `Received command: "add_ships", result: Player[${indexPlayer}] added Ships to Game[${gameId}].`
    );

    if (game.players.every((player) => player.ships.length > 0)) {
      this.gameService.startGame(game.gameId);

      game.players.forEach((player) => {
        const startGameMessage: StartGameResponse = {
          id: 0,
          type: 'start_game',
          data: {
            currentPlayerIndex: player.index,
            ships: player.ships,
          },
        };

        ctx.sendTo(player.index, startGameMessage);
      });

      console.log(
        `Sent command: "start_game", result: Game[${game.gameId}] has started.`
      );

      game.players.forEach((player) => {
        const turnMessage: TurnResponse = {
          id: 0,
          type: 'turn',
          data: { currentPlayer: game.currentPlayer },
        };
        ctx.sendTo(player.index, turnMessage);
      });
    }
  };
}
