import { Context, SendResponse } from '../messageServer';
import { IUserService } from '../services/userService';
import {
  RegisterRequest,
  RegisterResponse,
  RegisterResponseData,
} from '../types/message.types';
import { Session } from '../types/session.types';

export interface IRegisterController {
  register: (req: RegisterRequest, ctx: Context<Session>) => void;
}

export class RegisterController implements IRegisterController {
  constructor(private readonly userService: IUserService) {}

  register = (req: RegisterRequest, ctx: Context<Session>) => {
    function createResponse(data: RegisterResponseData): RegisterResponse {
      return {
        id: 0,
        type: 'reg',
        data,
      };
    }

    const { name, password } = req.data;

    let user = this.userService.getUserByName(name);
    if (!user) {
      user = this.userService.createUser(name, password);
    }

    if (!this.userService.isPasswordValid(name, password)) {
      console.log('Received command: "reg", result: Invalid password.');
      return ctx.reply(
        createResponse({
          index: 0,
          name: '',
          error: true,
          errorText: 'Invalid password.',
        })
      );
    }

    ctx.session.user = user;
    console.log(
      `Received command: "reg", result: User ${user.name}[${user.id}] logged in.`
    );
    return ctx.reply(
      createResponse({
        index: user.id,
        name: user.name,
        error: false,
        errorText: '',
      })
    );
  };
}
