import { Message } from '../messageServer';
import { UserDto } from './user.types';

export type RequestTypes = {
  reg: RegisterRequest;
  create_room: CreateRoomRequest;
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

export interface RegisterResponse extends Message<RequestTypes> {
  type: 'reg';
  data: RegisterResponseData;
}

export interface CreateRoomRequest extends Message<RequestTypes> {
  type: 'create_room';
  data: '';
}
