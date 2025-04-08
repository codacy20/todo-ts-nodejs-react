interface Task {
  id: string;
  title: string;
  description?: string;
  deadline?: Date;
  done: boolean;
  group?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const getAuthHeader = (): Record<string, string> => {
  if (typeof window === 'undefined') return {};

  const credentials = localStorage.getItem('credentials');
  if (!credentials) return {};

  try {
    const { username, password } = JSON.parse(credentials);
    const base64 = btoa(`${username}:${password}`);
    return {
      'Authorization': `Basic ${base64}`
    };
  } catch (e) {
    console.error('Failed to parse credentials from localStorage', e);
    return {};
  }
};

export async function fetchTasks(): Promise<Task[]> {
  const response = await fetch(`${API_URL}/tasks`, {
    headers: getAuthHeader()
  });

  if (!response.ok) {
    throw new Error(`Error fetching tasks: ${response.statusText}`);
  }

  const tasks = await response.json();

  return tasks.map((task: Task) => ({
    ...task,
    createdAt: new Date(task.createdAt),
    updatedAt: new Date(task.updatedAt),
    deadline: task.deadline ? new Date(task.deadline) : undefined
  }));
}

export async function createTask(task: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Task> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...getAuthHeader()
  };

  const response = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers,
    body: JSON.stringify(task)
  });

  if (!response.ok) {
    throw new Error(`Error creating task: ${response.statusText}`);
  }

  const newTask = await response.json();

  return {
    ...newTask,
    createdAt: new Date(newTask.createdAt),
    updatedAt: new Date(newTask.updatedAt),
    deadline: newTask.deadline ? new Date(newTask.deadline) : undefined
  };
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<Task> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...getAuthHeader()
  };

  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(updates)
  });

  if (!response.ok) {
    throw new Error(`Error updating task: ${response.statusText}`);
  }

  const updatedTask = await response.json();

  return {
    ...updatedTask,
    createdAt: new Date(updatedTask.createdAt),
    updatedAt: new Date(updatedTask.updatedAt),
    deadline: updatedTask.deadline ? new Date(updatedTask.deadline) : undefined
  };
}

export async function deleteTask(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'DELETE',
    headers: getAuthHeader()
  });

  if (!response.ok) {
    throw new Error(`Error deleting task: ${response.statusText}`);
  }
} 