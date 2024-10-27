import { Context } from '../messageServer';
import { UpdateRoomResponse } from '../types/message.types';
import { Room, RoomUser } from '../types/room.types';
import { Session } from '../types/session.types';

export interface IRoomService {
  createRoom: (user: RoomUser) => Room;
  getAvailableRooms: () => Room[];
  addUserToRoom: (user: RoomUser, roomId: number) => Room | null;
  broadcastUpdateRoomMessage: (ctx: Context<Session>) => void;
}

export class RoomService implements IRoomService {
  private nextRoomId: number = 1;

  private availableRooms: Room[] = [];

  createRoom(roomUser: RoomUser): Room {
    const newRoom: Room = {
      roomId: this.nextRoomId++,
      roomUsers: [roomUser],
    };
    this.availableRooms.push(newRoom);
    return newRoom;
  }

  getAvailableRooms(): Room[] {
    return this.availableRooms;
  }

  addUserToRoom(user: RoomUser, roomId: number): Room | null {
    const availableRoom = this.availableRooms.find(
      (room) => room.roomId === roomId
    );
    if (
      !availableRoom ||
      availableRoom.roomUsers.some((roomUser) => roomUser.index === user.index)
    ) {
      return null;
    }

    availableRoom.roomUsers.push(user);
    this.availableRooms = this.availableRooms.filter(
      (room) => room.roomId !== availableRoom.roomId
    );

    return availableRoom;
  }

  broadcastUpdateRoomMessage(ctx: Context<Session>): void {
    const updateRoomMessage: UpdateRoomResponse = {
      id: 0,
      type: 'update_room',
      data: this.availableRooms,
    };
    ctx.broadcast(updateRoomMessage);
    console.log(
      `Broadcast command: "update_room" with list of available rooms.`
    );
  }
}
