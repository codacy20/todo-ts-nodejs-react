import { Container } from 'inversify';
import { TaskService } from '../services/task.service.js';
import { TaskRepository } from '../repositories/task.repository.js';
import { TYPES } from '../types.js';
import { TaskController } from '../controllers/task.controller.js';
import { UserRepository } from '../interfaces/user.interface.js';
import { UserRepositoryImpl } from '../repositories/user.repository.js';
import { UserService } from '../services/user.service.js';
import { UserController as UserControllerImpl } from '../controllers/user.controller.js';
import { initializeAuthMiddleware } from '../middleware/index.js';

const container = new Container();

container.bind<TaskRepository>(TYPES.TaskRepository).to(TaskRepository);
container.bind<UserRepository>(TYPES.UserRepository).to(UserRepositoryImpl);

container.bind<TaskService>(TYPES.TaskService).to(TaskService);
container.bind<UserService>(TYPES.UserService).to(UserService);

const userRepository = container.get<UserRepository>(TYPES.UserRepository);
initializeAuthMiddleware(userRepository);

container.bind<TaskController>(TYPES.TaskController).to(TaskController);
container.bind<UserControllerImpl>(TYPES.UserController).to(UserControllerImpl);

export { container };
