export interface User {
  username: string;
  passwordHash: string;
}

export interface UserRepository {
  findUserByUsername(username: string): Promise<User | null>;
  createUser(user: User): Promise<User>;
} 