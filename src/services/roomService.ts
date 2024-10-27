import { Room, RoomUser } from '../types/room.types';

export interface IRoomService {
  createRoom: (user: RoomUser) => Room;
  getAvailableRooms: () => Room[];
  addUserToRoom: (userId: number, roomId: number) => void;
}

export class RoomService implements IRoomService {
  private nextRoomId: number = 1;

  private rooms: { [id: number]: Room } = {};

  private availableRooms: Room[] = [];

  createRoom({ index, name }: RoomUser): Room {
    const newRoom: Room = {
      roomId: this.nextRoomId++,
      roomUsers: [
        {
          index,
          name,
        },
      ],
    };
    this.rooms[newRoom.roomId] = newRoom;
    this.availableRooms.push(newRoom);
    return newRoom;
  }

  getAvailableRooms(): Room[] {
    return this.availableRooms;
  }

  addUserToRoom(userId: number, roomId: number): void {}
}
