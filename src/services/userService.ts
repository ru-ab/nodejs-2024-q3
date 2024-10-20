import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import { User } from '../types/user.type';

export class UserService {
  public getUsers(): User[] {
    return Object.values(db.users);
  }

  public getUser(id: string): User | undefined {
    return db.users[id];
  }

  public createUser(dto: Omit<User, 'id'>): User {
    const id = uuidv4();

    const user = {
      id,
      ...dto,
    };

    db.users[id] = user;

    return user;
  }

  public updateUser(id: string, dto: Omit<User, 'id'>): User | undefined {
    const user = this.getUser(id);
    if (!user) {
      return;
    }

    const newUser = {
      id,
      ...dto,
    };

    db.users[id] = newUser;

    return newUser;
  }
}
