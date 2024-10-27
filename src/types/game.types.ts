export type Position = {
  x: number;
  y: number;
};

export type Ship = {
  position: Position;
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
  damages?: number;
};

export type Player = {
  index: number;
  ships: Ship[];
  shots: Position[];
};

export type Game = {
  gameId: number;
  currentPlayer: number;
  players: Player[];
};

export type Attack = {
  gameId: number;
  x: number;
  y: number;
  indexPlayer: number;
};

export type AttackResult = {
  position: Position;
  currentPlayer: number;
  status: 'miss' | 'killed' | 'shot';
};
