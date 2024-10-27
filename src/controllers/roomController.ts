import { Context } from '../messageServer';
import { IRoomService } from '../services/roomService';
import {
  AddUserToRoomRequest,
  CreateGameResponse,
  CreateRoomRequest,
} from '../types/message.types';
import { RoomUser } from '../types/room.types';
import { Session } from '../types/session.types';

export interface IRoomController {
  createRoom: (req: CreateRoomRequest, ctx: Context<Session>) => void;
  addUserToRoom: (req: AddUserToRoomRequest, ctx: Context<Session>) => void;
}

export class RoomController implements IRoomController {
  constructor(private readonly roomService: IRoomService) {}

  createRoom = (req: CreateRoomRequest, ctx: Context<Session>): void => {
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

  addUserToRoom = (req: AddUserToRoomRequest, ctx: Context<Session>): void => {
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

    console.log(
      `Received command: "add_user_to_room", result: User ${user.name}[${user.index}] added to Room[${room.roomId}].`
    );

    const createGameResponse: Omit<CreateGameResponse, 'data'> = {
      id: 0,
      type: 'create_game',
    };

    room.roomUsers.forEach((roomUser) =>
      ctx.sendTo(roomUser.index, {
        ...createGameResponse,
        data: {
          idGame: 0,
          idPlayer: roomUser.index,
        },
      })
    );

    console.log(
      `Sent command: "create_game", result: Game[${0}] started with users: ${room.roomUsers.map(
        (roomUser) => `${roomUser.name}[${roomUser.index}`
      )}].`
    );
  };
}
