export interface Task {
  id: string;
  title: string;
  description?: string;
  deadline?: Date | undefined;
  done: boolean;
  group?: string | undefined;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
