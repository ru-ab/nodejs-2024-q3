import {
  Attack,
  AttackResult,
  Game,
  Position,
  Ship,
} from '../types/game.types';

export interface IGameService {
  createGame: (userIds: number[]) => Game;
  finishGame: (gameId: number) => void;
  getGame: (gameId: number) => Game | null;
  addShips: (gameId: number, playerId: number, ships: Ship[]) => Game | null;
  startGame: (gameId: number) => Game | null;
  attack: (attack: Attack) => AttackResult[] | null;
  isEndGame: (gameId: number, playerId: number) => boolean | null;
  getRandomTargetPosition: (
    gameId: number,
    playerId: number
  ) => Position | null;
  getGameWithPlayer: (playerId: number) => Game | null;
}

export class GameService implements IGameService {
  private nextGameId: number = 1;

  private games: Game[] = [];

  public createGame(playerIds: number[]): Game {
    const newGame: Game = {
      currentPlayer: 0,
      gameId: this.nextGameId++,
      players: playerIds.map((userId) => ({
        index: userId,
        ships: [],
        shots: [],
      })),
    };

    this.games.push(newGame);

    return newGame;
  }

  public getGame(gameId: number): Game | null {
    const game = this.games.find((game) => game.gameId === gameId);
    if (!game) {
      return null;
    }

    return game;
  }

  public addShips(
    gameId: number,
    playerId: number,
    ships: Ship[]
  ): Game | null {
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

  public startGame(gameId: number): Game | null {
    const game = this.games.find((game) => game.gameId === gameId);
    if (!game) {
      return null;
    }

    game.currentPlayer = game.players[0].index;

    return game;
  }

  public finishGame(gameId: number): void {
    this.games = this.games.filter((game) => game.gameId !== gameId);
  }

  public attack(attack: Attack): AttackResult[] | null {
    const game = this.games.find((game) => game.gameId === attack.gameId);
    if (!game) {
      return null;
    }

    const player = game.players.find(
      (player) => player.index === attack.indexPlayer
    );
    if (
      !player ||
      player.index !== game.currentPlayer ||
      player.shots.some((shot) => shot.x === attack.x && shot.y === attack.y)
    ) {
      return null;
    }

    player.shots.push({
      x: attack.x,
      y: attack.y,
    });

    const enemy = game.players.find(
      (player) => player.index !== attack.indexPlayer
    );
    if (!enemy) {
      return null;
    }

    let damagedShip: Ship | null = null;
    for (const ship of enemy.ships) {
      if (
        (!ship.direction &&
          attack.x >= ship.position.x &&
          attack.x < ship.position.x + ship.length &&
          attack.y === ship.position.y) ||
        (ship.direction &&
          attack.y >= ship.position.y &&
          attack.y < ship.position.y + ship.length &&
          attack.x === ship.position.x)
      ) {
        damagedShip = ship;
        break;
      }
    }

    if (!damagedShip) {
      const attackResult: AttackResult = {
        status: 'miss',
        currentPlayer: attack.indexPlayer,
        position: {
          x: attack.x,
          y: attack.y,
        },
      };

      game.currentPlayer = enemy.index;

      return [attackResult];
    }

    if (!damagedShip.damages) {
      damagedShip.damages = 1;
    } else {
      damagedShip.damages += 1;
    }

    const attackResult: AttackResult = {
      status: damagedShip.damages === damagedShip.length ? 'killed' : 'shot',
      currentPlayer: attack.indexPlayer,
      position: {
        x: attack.x,
        y: attack.y,
      },
    };

    const aroundCells: Position[] = [];
    if (attackResult.status === 'killed') {
      for (
        let x = damagedShip.position.x - 1;
        x <
        damagedShip.position.x +
          1 +
          (!damagedShip.direction ? damagedShip.length : 1);
        x += 1
      ) {
        for (
          let y = damagedShip.position.y - 1;
          y <
          damagedShip.position.y +
            1 +
            (damagedShip.direction ? damagedShip.length : 1);
          y += 1
        ) {
          if (
            x < 0 ||
            x > 9 ||
            y < 0 ||
            y > 9 ||
            player.shots.some((shot) => shot.x === x && shot.y === y)
          ) {
            continue;
          }

          aroundCells.push({ x, y });
        }
      }
    }

    aroundCells.forEach((cell) => player.shots.push(cell));

    return [
      attackResult,
      ...aroundCells.map((cell) => ({
        status: 'miss' as const,
        currentPlayer: attack.indexPlayer,
        position: {
          x: cell.x,
          y: cell.y,
        },
      })),
    ];
  }

  public isEndGame(gameId: number, playerId: number): boolean | null {
    const game = this.games.find((game) => game.gameId === gameId);
    if (!game) {
      return null;
    }

    const enemy = game.players.find((player) => player.index !== playerId);
    if (!enemy) {
      return null;
    }

    return !enemy.ships.some((ship) => (ship?.damages ?? 0) < ship.length);
  }

  public getRandomTargetPosition(
    gameId: number,
    playerId: number
  ): Position | null {
    const game = this.games.find((game) => game.gameId === gameId);
    if (!game) {
      return null;
    }

    const player = game.players.find((player) => player.index === playerId);
    if (!player) {
      return null;
    }

    const target: Position = {
      x: 0,
      y: 0,
    };
    do {
      target.x = Math.floor(Math.random() * 10);
      target.y = Math.floor(Math.random() * 10);
    } while (
      player.shots.some((shot) => shot.x === target.x && shot.y === target.y)
    );

    return target;
  }

  public getGameWithPlayer(playerId: number): Game | null {
    for (const game of this.games) {
      const player = game.players.find((player) => player.index === playerId);
      if (player) {
        return game;
      }
    }

    return null;
  }
}
