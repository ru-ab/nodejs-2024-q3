import { Context } from '../messageServer';
import { IBotService } from '../services/botService';
import { IGameService } from '../services/gameService';
import { IRoomService } from '../services/roomService';
import {
  AddUserToRoomRequest,
  CreateGameResponse,
  CreateRoomRequest,
  SinglePlayRequest,
} from '../types/message.types';
import { RoomUser } from '../types/room.types';
import { Session } from '../types/session.types';
import { User } from '../types/user.types';

export interface IRoomController {
  createRoom: (req: CreateRoomRequest, ctx: Context<Session>) => void;
  addUserToRoom: (req: AddUserToRoomRequest, ctx: Context<Session>) => void;
  removeUserRooms: (user: User, ctx: Context<Session>) => void;
  singlePlay: (req: SinglePlayRequest, ctx: Context<Session>) => Promise<void>;
}

export class RoomController implements IRoomController {
  constructor(
    private readonly roomService: IRoomService,
    private readonly gameService: IGameService,
    private readonly botService: IBotService
  ) {}

  public createRoom = (req: CreateRoomRequest, ctx: Context<Session>): void => {
    const user = ctx.session.user;
    if (!user) {
      return;
    }

    const roomUser: RoomUser = {
      index: user.index,
      name: user.name,
    };

    const room = this.roomService.createRoom(roomUser);
    console.log(
      `Received command: "create_room", result: Room[${room.roomId}] created. User ${roomUser.name}[${roomUser.index}] added to the room.`
    );

    this.roomService.broadcastUpdateRoomMessage(ctx);
  };

  public addUserToRoom = (
    req: AddUserToRoomRequest,
    ctx: Context<Session>
  ): void => {
    const user = ctx.session.user;
    if (!user) {
      return;
    }

    const room = this.roomService.addUserToRoom(
      { index: user.index, name: user.name },
      req.data.indexRoom
    );
    if (!room) {
      console.log(
        `Received command: "add_user_to_room", result: The room is not exists or User ${user.name}[${user.index}] is already in the room.`
      );
      return;
    }

    this.roomService.broadcastUpdateRoomMessage(ctx);

    console.log(
      `Received command: "add_user_to_room", result: User ${user.name}[${user.index}] added to Room[${room.roomId}].`
    );

    const game = this.gameService.createGame(
      room.roomUsers.map((roomUser) => roomUser.index)
    );

    const createGameResponse: Omit<CreateGameResponse, 'data'> = {
      id: 0,
      type: 'create_game',
    };

    game.players.forEach((player) =>
      ctx.sendTo(player.index, {
        ...createGameResponse,
        data: {
          idGame: game.gameId,
          idPlayer: player.index,
        },
      })
    );

    console.log(
      `Sent command: "create_game", result: Game[${0}] has created with users: ${room.roomUsers.map(
        (roomUser) => `${roomUser.name}[${roomUser.index}]`
      )}.`
    );
  };

  public removeUserRooms = (user: User, ctx: Context<Session>) => {
    this.roomService.removeUserRooms(user.index);
    console.log(`User ${user.name}[${user.index}] rooms removed.`);
    this.roomService.broadcastUpdateRoomMessage(ctx);
  };

  public singlePlay = async (req: SinglePlayRequest, ctx: Context<Session>) => {
    const user = ctx.session.user;
    if (!user) {
      return;
    }

    const room = this.roomService.createRoom(user);
    await this.botService.addBotToRoom(room.roomId);

    console.log(
      `Received command: "single_play" from user: ${user.name}[${user.index}].`
    );
  };
}
