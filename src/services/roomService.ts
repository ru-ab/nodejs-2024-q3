import { Room } from '../types/room.types';
import { User } from '../types/user.types';

export interface IRoomService {
  createRoom: (user: User) => Room;
  addUserToRoom: (userId: number, roomId: number) => void;
}

export class RoomService implements IRoomService {
  private nextRoomId: number = 1;

  private rooms: { [id: number]: Room } = {};

  createRoom({ id, name }: User): Room {
    const newRoom: Room = {
      id: this.nextRoomId++,
      user1: {
        index: id,
        name,
      },
      user2: null,
    };
    this.rooms[newRoom.id] = newRoom;
    return newRoom;
  }

  addUserToRoom(userId: number, roomId: number): void {}
}
