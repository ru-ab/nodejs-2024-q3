import { Message } from '../router';

export type HandlerDataTypes = {
  reg: RegisterMessage;
};

export interface RegisterMessage extends Message<HandlerDataTypes> {
  type: 'reg';
  data: {
    name: string;
    password: string;
  };
}
