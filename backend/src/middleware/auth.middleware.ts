import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { BaseMiddleware } from 'inversify-express-utils';
import { compare } from 'bcrypt';
import { UserRepository } from '../interfaces/user.interface.js';
import { TYPES } from '../types.js';

@injectable()
export class AuthMiddleware extends BaseMiddleware {
  constructor(@inject(TYPES.UserRepository) private userRepository: UserRepository) {
    super();
  }

  public async handler(req: Request, res: Response, next: NextFunction): Promise<void> {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      this.handleUnauthorized(res);
      return;
    }

    const [username, password] = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');

    const user = await this.userRepository.findUserByUsername(username);
    if (!user) {
      this.handleUnauthorized(res);
      return;
    }

    if (!(await compare(password, user.passwordHash))) {
      this.handleUnauthorized(res);
      return;
    }

    req.user = { username };
    next();
  }

  private handleUnauthorized(res: Response): void {
    res.setHeader('WWW-Authenticate', 'Basic');
    res.status(401).json({ message: 'Unauthorized' });
  }
}
