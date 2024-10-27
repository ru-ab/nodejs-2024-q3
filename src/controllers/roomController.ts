import { Context } from '../messageServer';
import { IRoomService } from '../services/roomService';
import { CreateRoomRequest, UpdateRoomResponse } from '../types/message.types';
import { RoomUser } from '../types/room.types';
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

    const roomUser: RoomUser = {
      index: user.id,
      name: user.name,
    };

    const room = this.roomService.createRoom(roomUser);

    this.roomService.addUserToRoom(user.id, room.roomId);
    console.log(
      `Received command: "create_room", result: Room[${room.roomId}] created. User ${user.name}[${user.id}] added to the room.`
    );

    const availableRooms = this.roomService.getAvailableRooms();

    const updateRoomMessage: UpdateRoomResponse = {
      id: 0,
      type: 'update_room',
      data: availableRooms,
    };
    ctx.broadcast(updateRoomMessage);
    console.log(
      `Broadcast command: "update_room", result: Room[${room.roomId}] updated.`
    );
  };
}
