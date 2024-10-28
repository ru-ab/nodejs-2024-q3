export type User = {
  index: number;
  name: string;
  password: string;
};

export type UserDto = Omit<User, 'index'>;
