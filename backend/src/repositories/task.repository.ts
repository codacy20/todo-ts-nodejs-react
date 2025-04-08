import { injectable } from 'inversify';
import { Repository } from '../interfaces/repository.interface.js';
import { Task } from '../interfaces/task.interface.js';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

type Data = {
  tasks: Task[];
};

@injectable()
export class TaskRepository implements Repository<Task> {
  private db: Low<Data>;

  constructor() {
    const adapter = new JSONFile<Data>('db.json');
    this.db = new Low(adapter, { tasks: [] });
  }

  async findAll(userId: string): Promise<Task[]> {
    await this.db.read();
    return this.db.data.tasks.filter(task => task.userId === userId);
  }

  async findById(id: string, userId: string): Promise<Task | null> {
    await this.db.read();
    return this.db.data.tasks.find((task) => task.id === id && task.userId === userId) || null;
  }

  async create(task: Task): Promise<Task> {
    await this.db.read();
    this.db.data.tasks.push(task);
    await this.db.write();
    return task;
  }

  async update(id: string, taskUpdates: Partial<Task>, userId: string): Promise<Task | null> {
    await this.db.read();
    const task = this.db.data.tasks.find((task) => task.id === id && task.userId === userId);
    if (!task) return null;
    Object.assign(task, taskUpdates, { updatedAt: new Date() });
    await this.db.write();
    return task;
  }

  async delete(id: string, userId: string): Promise<boolean> {
    await this.db.read();
    const initialLength = this.db.data.tasks.length;
    this.db.data.tasks = this.db.data.tasks.filter((task) => task.id !== id || task.userId !== userId);
    await this.db.write();
    return this.db.data.tasks.length < initialLength;
  }
}
