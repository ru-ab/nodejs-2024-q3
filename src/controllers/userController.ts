import { Context } from '../messageServer';
import { RoomService } from '../services/roomService';
import { IUserService } from '../services/userService';
import { RegisterRequest } from '../types/message.types';
import { Session } from '../types/session.types';

export interface IUserController {
  register: (req: RegisterRequest, ctx: Context<Session>) => void;
}

export class UserController implements IUserController {
  constructor(
    private readonly userService: IUserService,
    private readonly roomService: RoomService
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

    ctx.session.user = user;
    ctx.registerConnection(user);
    console.log(
      `Received command: "reg", result: User ${user.name}[${user.index}] logged in.`
    );

    this.roomService.broadcastUpdateRoomMessage(ctx);

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
