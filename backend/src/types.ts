declare global {
  namespace Express {
    interface Request {
      user: {
        username: string;
      };
    }
  }
}

export const TYPES = {
  TaskService: Symbol.for('TaskService'),
  TaskRepository: Symbol.for('TaskRepository'),
  TaskController: Symbol.for('TaskController'),
  UserRepository: Symbol.for('UserRepository'),
  UserService: Symbol.for('UserService'),
  UserController: Symbol.for('UserController'),
  AuthMiddleware: Symbol.for('AuthMiddleware'),
};
