import { Request, Response, NextFunction } from 'express';
import { compare } from 'bcrypt';
import { UserRepository } from '../interfaces/user.interface.js';

export const getUsernameFromAuthHeader = (authHeader: string | undefined): string | null => {
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return null;
  }
  const encoded = authHeader.split(' ')[1];
  const [username] = Buffer.from(encoded, 'base64').toString().split(':');
  return username;
};

export const createBasicAuthMiddleware = (userRepository: UserRepository) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const username = getUsernameFromAuthHeader(req.headers.authorization);

    if (!username) {
      res.setHeader('WWW-Authenticate', 'Basic');
      res.status(401).send('Unauthorized');
      return;
    }

    const user = await userRepository.findUserByUsername(username);
    if (!user) {
      res.setHeader('WWW-Authenticate', 'Basic');
      res.status(401).send('Unauthorized');
      return;
    }

    const [_, password] = Buffer.from(req.headers.authorization!.split(' ')[1], 'base64').toString().split(':');
    if (!(await compare(password, user.passwordHash))) {
      res.setHeader('WWW-Authenticate', 'Basic');
      res.status(401).send('Unauthorized');
      return;
    }

    next();
  };
};
