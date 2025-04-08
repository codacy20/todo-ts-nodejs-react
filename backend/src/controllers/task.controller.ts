import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, httpPost, httpPut, httpDelete } from 'inversify-express-utils';
import { TaskService } from '../services/task.service.js';
import { TYPES } from '../types.js';
import { getUsernameFromAuthHeader } from '../middleware/auth.middleware.js';
import { basicAuthMiddleware } from '../middleware/index.js';


@controller('/tasks', basicAuthMiddleware)
export class TaskController {
  constructor(@inject(TYPES.TaskService) private taskService: TaskService) { }

  @httpGet('/')
  async getAll(req: Request, res: Response): Promise<void> {
    const username = getUsernameFromAuthHeader(req.headers.authorization);
    if (!username) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const tasks = await this.taskService.getAllTasks(username);
    res.json(tasks);
  }

  @httpGet('/:id')
  async getById(req: Request, res: Response): Promise<void> {
    const username = getUsernameFromAuthHeader(req.headers.authorization);
    if (!username) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const task = await this.taskService.getTaskById(req.params.id, username);
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    res.json(task);
  }

  @httpPost('/')
  async create(req: Request, res: Response): Promise<void> {
    const username = getUsernameFromAuthHeader(req.headers.authorization);
    if (!username) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const newTask = await this.taskService.createTask(req.body, username);
    res.status(201).json(newTask);
  }

  @httpPut('/:id')
  async update(req: Request, res: Response): Promise<void> {
    const username = getUsernameFromAuthHeader(req.headers.authorization);
    if (!username) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const updatedTask = await this.taskService.updateTask(req.params.id, req.body, username);
    if (!updatedTask) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    res.json(updatedTask);
  }

  @httpDelete('/:id')
  async delete(req: Request, res: Response): Promise<void> {
    const username = getUsernameFromAuthHeader(req.headers.authorization);
    if (!username) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const success = await this.taskService.deleteTask(req.params.id, username);
    if (!success) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    res.status(204).send();
  }
}
