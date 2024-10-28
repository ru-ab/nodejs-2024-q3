import { User } from '../types/user.types';

export interface IUserService {
  getUser: (userId: number) => User | null;
  getUserByName: (name: string) => User | null;
  isPasswordValid: (name: string, password: string) => boolean;
  createUser: (name: string, password: string) => User;
}

export class UserService implements IUserService {
  private nextUserId: number = 1;

  private users: { [name: string]: User } = {};

  getUser(userId: number): User | null {
    const user = Object.values(this.users).find(
      (user) => user.index === userId
    );
    if (!user) {
      return null;
    }

    return user;
  }

  getUserByName(name: string): User | null {
    if (!this.users[name]) {
      return null;
    }

    return this.users[name];
  }

  createUser(name: string, password: string): User {
    const newUser: User = {
      index: this.nextUserId++,
      name,
      password,
    };
    this.users[name] = newUser;
    return newUser;
  }

  isPasswordValid(name: string, password: string): boolean {
    const user = this.getUserByName(name);
    return user?.password === password;
  }
}
