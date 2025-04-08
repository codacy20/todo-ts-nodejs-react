import { inject, injectable } from 'inversify';
import { UserRepository } from '../interfaces/user.interface.js';
import { UserModel } from '../models/user.model.js';
import { compare, hash } from 'bcrypt';
import { TYPES } from '../types.js';

@injectable()
export class UserService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: UserRepository
  ) { }

  async createUser(username: string, password: string): Promise<UserModel> {
    const existingUser = await this.userRepository.findUserByUsername(username);
    if (existingUser) {
      throw new Error('Username already exists');
    }

    const passwordHash = await hash(password, 10);
    const user = new UserModel(username, passwordHash);
    return this.userRepository.createUser(user);
  }

  async validateUser(username: string, password: string): Promise<boolean> {
    const user = await this.userRepository.findUserByUsername(username);
    if (!user) {
      return false;
    }

    return compare(password, user.passwordHash);
  }
} 