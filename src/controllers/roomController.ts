import { Context, SendResponse } from '../messageServer';
import { IRoomService } from '../services/roomService';
import { CreateRoomRequest } from '../types/message.types';
import { Session } from '../types/session.types';

export interface IRoomController {
  createRoom: (req: CreateRoomRequest, ctx: Context<Session>) => void;
}

export class RoomController implements IRoomController {
  constructor(private readonly roomService: IRoomService) {}

  createRoom = (req: CreateRoomRequest, ctx: Context<Session>): void => {
    const user = ctx.session.user;
    if (!user) {
      return;
    }

    const room = this.roomService.createRoom(user);
    this.roomService.addUserToRoom(user.id, room.id);
    console.log(
      `Received command: "create_room", result: Room[${room.id}] created. User ${user.name}[${user.id}] added to the room.`
    );
  };
}
