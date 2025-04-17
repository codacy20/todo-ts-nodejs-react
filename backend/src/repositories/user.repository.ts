import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { User, UserRepository } from '../interfaces/user.interface.js';
import { injectable } from 'inversify';

type AuthData = { users: User[] };

@injectable()
export class UserRepositoryImpl implements UserRepository {
  private adapter = new JSONFile<AuthData>('auth.json');
  private db = new Low<AuthData>(this.adapter, { users: [] });

  constructor() {
    this.initializeDatabase();
  }

  private async initializeDatabase() {
    await this.db.read();
    if (!this.db.data || !this.db.data.users) {
      this.db.data = { users: [] };
      await this.db.write();
    }
  }

  async findUserByUsername(username: string): Promise<User | null> {
    await this.db.read();
    return this.db.data.users.find((user) => user.username === username) || null;
  }

  async createUser(user: User): Promise<User> {
    await this.db.read();
    this.db.data.users.push(user);
    await this.db.write();
    return user;
  }
}
