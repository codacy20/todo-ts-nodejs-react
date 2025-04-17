import { User } from '../interfaces/user.interface.js';

export class UserModel implements User {
  constructor(public username: string, public passwordHash: string) {}
}
