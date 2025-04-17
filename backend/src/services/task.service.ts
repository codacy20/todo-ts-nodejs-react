import { inject, injectable } from 'inversify';
import { TYPES } from '../types.js';
import { Repository } from '../interfaces/repository.interface.js';
import { Task } from '../interfaces/task.interface.js';
import { v4 as uuid } from 'uuid';

@injectable()
export class TaskService {
  constructor(@inject(TYPES.TaskRepository) private taskRepository: Repository<Task>) {}

  async getAllTasks(userId: string): Promise<Task[]> {
    return await this.taskRepository.findAll(userId);
  }

  async getTaskById(id: string, userId: string): Promise<Task | null> {
    return await this.taskRepository.findById(id, userId);
  }

  async createTask(taskData: Partial<Task>, userId: string): Promise<Task> {
    const task: Task = {
      id: uuid(),
      title: taskData.title || 'Untitled Task',
      description: taskData.description || '',
      deadline: taskData.deadline,
      done: false,
      group: taskData.group,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return await this.taskRepository.create(task);
  }

  async updateTask(id: string, taskData: Partial<Task>, userId: string): Promise<Task | null> {
    return await this.taskRepository.update(id, taskData, userId);
  }

  async deleteTask(id: string, userId: string): Promise<boolean> {
    return await this.taskRepository.delete(id, userId);
  }
}
