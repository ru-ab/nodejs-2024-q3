import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import { User } from '../types/user.type';

export class UserService {
  public getUsers(): User[] {
    return db.users;
  }

  public createUser(dto: Omit<User, 'id'>): User {
    const user = {
      id: uuidv4(),
      ...dto,
    };

    db.users.push(user);

    return user;
  }
}
