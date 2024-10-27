export type Ship = {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
};

export type Player = {
  index: number;
  ships: Ship[];
};

export type Game = {
  gameId: number;
  currentPlayer: number;
  players: Player[];
};
