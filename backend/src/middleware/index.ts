import { Request, Response, NextFunction } from 'express';
import { UserRepository } from '../interfaces/user.interface.js';
import { createBasicAuthMiddleware } from './auth.middleware.js';

export type ExpressMiddleware = (req: Request, res: Response, next: NextFunction) => Promise<void> | void;

let _middlewareImplementation: ExpressMiddleware | null = null;

export const basicAuthMiddleware: ExpressMiddleware = (req, res, next) => {
    if (!_middlewareImplementation) {
        throw new Error('Authentication middleware not initialized yet. Ensure initializeAuthMiddleware is called before server startup.');
    }
    return _middlewareImplementation(req, res, next);
};

export const initializeAuthMiddleware = (userRepository: UserRepository): void => {
    _middlewareImplementation = createBasicAuthMiddleware(userRepository);
    console.log('Auth middleware initialized successfully');
}; 