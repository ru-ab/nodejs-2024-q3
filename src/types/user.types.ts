export type User = {
  id: number;
  name: string;
  password: string;
};

export type UserDto = Omit<User, 'id'>;
