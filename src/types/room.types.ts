export type RoomUser = {
  index: number;
  name: string;
};

export type Room = {
  roomId: number;
  roomUsers: RoomUser[];
};
