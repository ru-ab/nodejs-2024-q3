import { Game, Ship } from '../types/game.types';

export interface IGameService {
  createGame: (userIds: number[]) => Game;
  addShips: (gameId: number, playerId: number, ships: Ship[]) => Game | null;
}

export class GameService implements IGameService {
  private nextGameId: number = 1;

  private games: Game[] = [];

  createGame(playerIds: number[]): Game {
    const newGame: Game = {
      gameId: this.nextGameId++,
      players: playerIds.map((userId) => ({ index: userId, ships: [] })),
    };

    this.games.push(newGame);

    return newGame;
  }

  addShips(gameId: number, playerId: number, ships: Ship[]): Game | null {
    const game = this.games.find((game) => game.gameId === gameId);
    if (!game) {
      return null;
    }

    const player = game.players.find((player) => player.index === playerId);
    if (!player) {
      return null;
    }

    player.ships = ships;
    return game;
  }
}
