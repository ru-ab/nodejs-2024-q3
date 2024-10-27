import { Room, RoomUser } from '../types/room.types';

export interface IRoomService {
  createRoom: (user: RoomUser) => Room;
  addUserToRoom: (userId: number, roomId: number) => void;
}

export class RoomService implements IRoomService {
  private nextRoomId: number = 1;

  private rooms: { [id: number]: Room } = {};

  createRoom({ index, name }: RoomUser): Room {
    const newRoom: Room = {
      id: this.nextRoomId++,
      user1: {
        index,
        name,
      },
      user2: null,
    };
    this.rooms[newRoom.id] = newRoom;
    return newRoom;
  }

  addUserToRoom(userId: number, roomId: number): void {}
}
