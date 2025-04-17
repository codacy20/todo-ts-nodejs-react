import { Container } from 'inversify';
import { TaskService } from '../services/task.service.js';
import { TaskRepository } from '../repositories/task.repository.js';
import { TYPES } from '../types.js';
import { UserRepository } from '../interfaces/user.interface.js';
import { UserRepositoryImpl } from '../repositories/user.repository.js';
import { UserService } from '../services/user.service.js';
import { AuthMiddleware } from '../middleware/auth.middleware.js';
import { Repository } from '../interfaces/repository.interface.js';
import { Task } from '../interfaces/task.interface.js';
import { TaskController } from '../controllers/task.controller.js';
import { UserController } from '../controllers/user.controller.js';

const container = new Container();

// Repository bindings
container.bind<Repository<Task>>(TYPES.TaskRepository).to(TaskRepository);
container.bind<UserRepository>(TYPES.UserRepository).to(UserRepositoryImpl);

// Service bindings
container.bind<TaskService>(TYPES.TaskService).to(TaskService);
container.bind<UserService>(TYPES.UserService).to(UserService);

// Middleware bindings
container.bind<AuthMiddleware>(TYPES.AuthMiddleware).to(AuthMiddleware);

// Controller bindings
container.bind<TaskController>(TYPES.TaskController).to(TaskController);
container.bind<UserController>(TYPES.UserController).to(UserController);

export { container };
