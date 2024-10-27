import {
  Attack,
  AttackResult,
  Game,
  Position,
  Ship,
} from '../types/game.types';

export interface IGameService {
  createGame: (userIds: number[]) => Game;
  getGame: (gameId: number) => Game | null;
  addShips: (gameId: number, playerId: number, ships: Ship[]) => Game | null;
  startGame: (gameId: number) => Game | null;
  attack: (attack: Attack) => AttackResult[] | null;
  isEndGame: (gameId: number, playerId: number) => boolean | null;
}

const shipLengths = {
  small: 1,
  medium: 2,
  large: 3,
  huge: 4,
};

export class GameService implements IGameService {
  private nextGameId: number = 1;

  private games: Game[] = [];

  createGame(playerIds: number[]): Game {
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

  getGame(gameId: number): Game | null {
    const game = this.games.find((game) => game.gameId === gameId);
    if (!game) {
      return null;
    }

    return game;
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

  startGame(gameId: number): Game | null {
    const game = this.games.find((game) => game.gameId === gameId);
    if (!game) {
      return null;
    }

    game.currentPlayer = game.players[0].index;

    return game;
  }

  attack(attack: Attack): AttackResult[] | null {
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
          attack.x < ship.position.x + shipLengths[ship.type] &&
          attack.y === ship.position.y) ||
        (ship.direction &&
          attack.y >= ship.position.y &&
          attack.y < ship.position.y + shipLengths[ship.type] &&
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
      status:
        damagedShip.damages === shipLengths[damagedShip.type]
          ? 'killed'
          : 'shot',
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
          (!damagedShip.direction ? shipLengths[damagedShip.type] : 1);
        x += 1
      ) {
        for (
          let y = damagedShip.position.y - 1;
          y <
          damagedShip.position.y +
            1 +
            (damagedShip.direction ? shipLengths[damagedShip.type] : 1);
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

  isEndGame(gameId: number, playerId: number): boolean | null {
    const game = this.games.find((game) => game.gameId === gameId);
    if (!game) {
      return null;
    }

    const enemy = game.players.find((player) => player.index !== playerId);
    if (!enemy) {
      return null;
    }

    return !enemy.ships.some(
      (ship) => (ship?.damages ?? 0) < shipLengths[ship.type]
    );
  }
}
