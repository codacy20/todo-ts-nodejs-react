import { inject } from 'inversify';
import { Request, Response } from 'express';
import { UserService } from '../services/user.service.js';
import { controller, httpPost } from 'inversify-express-utils';
import { TYPES } from '../types.js';

@controller('/users')
export class UserController {
  constructor(@inject(TYPES.UserService) private userService: UserService) {}

  @httpPost('/register')
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        res.status(400).json({ error: 'Username and password are required' });
        return;
      }

      const user = await this.userService.createUser(username, password);
      res.status(201).json({ message: 'User created successfully', username: user.username });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  @httpPost('/login')
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        res.status(400).json({ error: 'Username and password are required' });
        return;
      }

      const isValid = await this.userService.validateUser(username, password);
      if (!isValid) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      res.status(200).json({ message: 'Login successful' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
