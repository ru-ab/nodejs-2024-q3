type RoomUser = {
  index: number;
  name: string;
};

export type Room = {
  id: number;
  user1: RoomUser;
  user2: RoomUser | null;
};
