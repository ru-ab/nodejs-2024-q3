import { Context } from '../messageServer';
import { IGameService } from '../services/gameService';
import { IUserService } from '../services/userService';
import { IWinnerService } from '../services/winnerService';
import { Game } from '../types/game.types';
import {
  AddShipsRequest,
  AttackRequest,
  AttackResponse,
  FinishResponse,
  RandomAttackRequest,
  StartGameResponse,
  TurnResponse,
} from '../types/message.types';
import { Session } from '../types/session.types';

export interface IGameController {
  addShips: (req: AddShipsRequest, ctx: Context<Session>) => void;
  attack: (req: AttackRequest, ctx: Context<Session>) => void;
  randomAttack: (req: RandomAttackRequest, ctx: Context<Session>) => void;
}

export class GameController implements IGameController {
  constructor(
    private readonly gameService: IGameService,
    private readonly winnerService: IWinnerService,
    private readonly userService: IUserService
  ) {}

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

      this.sendTurn(game, ctx);
    }
  };

  public attack = (req: AttackRequest, ctx: Context<Session>): void => {
    const attackResults = this.gameService.attack(req.data);
    if (!attackResults) {
      return;
    }

    const game = this.gameService.getGame(req.data.gameId);
    if (!game) {
      return;
    }

    attackResults.forEach((attackResult) => {
      game.players.forEach((player) => {
        const attackResponse: AttackResponse = {
          id: 0,
          type: 'attack',
          data: attackResult,
        };

        ctx.sendTo(player.index, attackResponse);
      });
    });

    console.log(
      `Received command: "${req.type}", shot: x=${req.data.x} y=${
        req.data.y
      }, result: Player[${req.data.indexPlayer}] ${
        attackResults[0].status === 'miss'
          ? 'missed'
          : attackResults[0].status === 'shot'
          ? 'hit enemy ship'
          : 'killed enemy ship'
      }.`
    );

    if (this.gameService.isEndGame(req.data.gameId, req.data.indexPlayer)) {
      const finishMessage: FinishResponse = {
        id: 0,
        type: 'finish',
        data: {
          winPlayer: req.data.indexPlayer,
        },
      };

      game.players.forEach((player) => ctx.sendTo(player.index, finishMessage));

      const user = this.userService.getUser(req.data.indexPlayer);
      if (!user) {
        return;
      }
      this.winnerService.updateWinner(user.name);
      this.winnerService.broadcastUpdateWinnersMessage(ctx);
    } else {
      this.sendTurn(game, ctx);
    }
  };

  public randomAttack = (
    req: RandomAttackRequest,
    ctx: Context<Session>
  ): void => {
    const target = this.gameService.getRandomTargetPosition(
      req.data.gameId,
      req.data.indexPlayer
    );
    if (!target) {
      return;
    }

    this.attack(
      {
        id: 0,
        type: 'randomAttack' as 'attack',
        data: {
          gameId: req.data.gameId,
          indexPlayer: req.data.indexPlayer,
          x: target.x,
          y: target.y,
        },
      },
      ctx
    );
  };

  private sendTurn(game: Game, ctx: Context<Session>) {
    game.players.forEach((player) => {
      const turnMessage: TurnResponse = {
        id: 0,
        type: 'turn',
        data: { currentPlayer: game.currentPlayer },
      };
      ctx.sendTo(player.index, turnMessage);
    });
  }
}
