export interface Repository<T> {
  findAll(userId: string): Promise<T[]>;
  findById(id: string, userId: string): Promise<T | null>;
  create(item: T): Promise<T>;
  update(id: string, item: Partial<T>, userId: string): Promise<T | null>;
  delete(id: string, userId: string): Promise<boolean>;
}
