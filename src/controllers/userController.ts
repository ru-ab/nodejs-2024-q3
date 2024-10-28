import { Context } from '../messageServer';
import { IRoomService } from '../services/roomService';
import { IUserService } from '../services/userService';
import { IWinnerService } from '../services/winnerService';
import { RegisterRequest } from '../types/message.types';
import { Session } from '../types/session.types';

export interface IUserController {
  register: (req: RegisterRequest, ctx: Context<Session>) => void;
}

export class UserController implements IUserController {
  constructor(
    private readonly userService: IUserService,
    private readonly roomService: IRoomService,
    private readonly winnerService: IWinnerService
  ) {}

  register = (req: RegisterRequest, ctx: Context<Session>) => {
    const { name, password } = req.data;

    let user = this.userService.getUserByName(name);
    if (!user) {
      user = this.userService.createUser(name, password);
    }

    if (!this.userService.isPasswordValid(name, password)) {
      console.log(
        `Received command: "reg", result: Invalid password for User ${user.name}[${user.index}].`
      );
      return ctx.reply({
        id: 0,
        type: 'reg',
        data: {
          index: 0,
          name: '',
          error: true,
          errorText: 'Invalid password.',
        },
      });
    }

    const registered = ctx.registerConnection(user);
    if (!registered) {
      return ctx.reply({
        id: 0,
        type: 'reg',
        data: {
          index: 0,
          name: '',
          error: true,
          errorText: 'User already connected.',
        },
      });
    }

    ctx.session.user = user;
    console.log(
      `Received command: "reg", result: User ${user.name}[${user.index}] logged in.`
    );

    this.roomService.broadcastUpdateRoomMessage(ctx);
    this.winnerService.broadcastUpdateWinnersMessage(ctx);

    return ctx.reply({
      id: 0,
      type: 'reg',
      data: {
        index: user.index,
        name: user.name,
        error: false,
        errorText: '',
      },
    });
  };
}
