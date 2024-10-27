import { Message } from '../messageServer';
import { Attack, AttackResult, Ship } from './game.types';
import { Room } from './room.types';
import { UserDto } from './user.types';
import { Winner } from './winner.types';

export type RequestTypes = {
  reg: RegisterRequest;
  create_room: CreateRoomRequest;
  add_user_to_room: AddUserToRoomRequest;
  add_ships: AddShipsRequest;
  attack: AttackRequest;
};

export type ResponseTypes = {
  reg: RegisterResponse;
  update_room: UpdateRoomResponse;
  create_game: CreateGameResponse;
  start_game: StartGameResponse;
  turn: TurnResponse;
  attack: AttackResponse;
  finish: FinishResponse;
  update_winners: UpdateWinnersResponse;
};

export interface RegisterRequest extends Message<RequestTypes> {
  type: 'reg';
  data: UserDto;
}

export type RegisterResponseData = {
  name: string;
  index: number | string;
  error: boolean;
  errorText: string;
};

export interface RegisterResponse extends Message<ResponseTypes> {
  type: 'reg';
  data: RegisterResponseData;
}

export interface CreateRoomRequest extends Message<RequestTypes> {
  type: 'create_room';
  data: '';
}

export interface UpdateRoomResponse extends Message<ResponseTypes> {
  type: 'update_room';
  data: Room[];
}

export interface AddUserToRoomRequest extends Message<RequestTypes> {
  type: 'add_user_to_room';
  data: {
    indexRoom: number;
  };
}

export interface CreateGameResponse extends Message<ResponseTypes> {
  type: 'create_game';
  data: {
    idGame: number;
    idPlayer: number;
  };
}

export interface AddShipsRequest extends Message<RequestTypes> {
  type: 'add_ships';
  data: {
    gameId: number;
    ships: Ship[];
    indexPlayer: number;
  };
}

export interface StartGameResponse extends Message<ResponseTypes> {
  type: 'start_game';
  data: {
    ships: Ship[];
    currentPlayerIndex: number;
  };
}

export interface TurnResponse extends Message<ResponseTypes> {
  type: 'turn';
  data: {
    currentPlayer: number;
  };
}

export interface AttackRequest extends Message<RequestTypes> {
  type: 'attack';
  data: Attack;
}

export interface AttackResponse extends Message<ResponseTypes> {
  type: 'attack';
  data: AttackResult;
}

export interface FinishResponse extends Message<ResponseTypes> {
  type: 'finish';
  data: {
    winPlayer: number;
  };
}

export interface UpdateWinnersResponse extends Message<ResponseTypes> {
  type: 'update_winners';
  data: Winner[];
}
