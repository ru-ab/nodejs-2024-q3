import { Message } from '../messageServer';
import { Room } from './room.types';
import { UserDto } from './user.types';

export type RequestTypes = {
  reg: RegisterRequest;
  create_room: CreateRoomRequest;
  add_user_to_room: AddUserToRoomRequest;
};

export type ResponseTypes = {
  reg: RegisterResponse;
  update_room: UpdateRoomResponse;
  create_game: CreateGameResponse;
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
