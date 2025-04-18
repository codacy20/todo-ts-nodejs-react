import { describe, test, expect, beforeEach, vi } from 'vitest';
import { TaskController } from '#@/controllers/task.controller.js';
import { Request, Response } from 'express';
import { Task } from '#@/interfaces/task.interface.js';
import { TaskService } from '#@/services/task.service.js';

const getAllTasksMock = vi.fn();
const getTaskByIdMock = vi.fn();
const createTaskMock = vi.fn();
const updateTaskMock = vi.fn();
const deleteTaskMock = vi.fn();

const mockTaskService = {
  getAllTasks: getAllTasksMock,
  getTaskById: getTaskByIdMock,
  createTask: createTaskMock,
  updateTask: updateTaskMock,
  deleteTask: deleteTaskMock,
} as unknown as TaskService;

const createMockReq = (params = {}, body = {}, user = { username: 'testuser' }): Partial<Request> => ({
  params,
  body,
  user,
});

const createMockRes = (): Partial<Response> => {
  const res: Partial<Response> = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
  };
  return res;
};

describe('TaskController', () => {
  let controller: TaskController;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    controller = new TaskController(mockTaskService);
    mockRes = createMockRes();
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    test('should return all tasks for the user', async () => {
      const mockTasks: Task[] = [
        {
          id: '1',
          title: 'Test Task',
          done: false,
          userId: 'testuser',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      getAllTasksMock.mockResolvedValue(mockTasks);
      mockReq = createMockReq();

      await controller.getAll(mockReq as Request, mockRes as Response);

      expect(getAllTasksMock).toHaveBeenCalledWith('testuser');
      expect(mockRes.json).toHaveBeenCalledWith(mockTasks);
    });
  });

  describe('getById', () => {
    test('should return task when found', async () => {
      const mockTask: Task = {
        id: '1',
        title: 'Test Task',
        done: false,
        userId: 'testuser',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      getTaskByIdMock.mockResolvedValue(mockTask);
      mockReq = createMockReq({ id: '1' });

      await controller.getById(mockReq as Request, mockRes as Response);

      expect(getTaskByIdMock).toHaveBeenCalledWith('1', 'testuser');
      expect(mockRes.json).toHaveBeenCalledWith(mockTask);
    });

    test('should return 404 when task not found', async () => {
      getTaskByIdMock.mockResolvedValue(null);
      mockReq = createMockReq({ id: '1' });

      await controller.getById(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Task not found' });
    });
  });

  describe('create', () => {
    test('should create and return new task', async () => {
      const taskData = {
        title: 'New Task',
        description: 'Test Description'
      };

      const mockTask: Task = {
        ...taskData,
        id: '1',
        done: false,
        userId: 'testuser',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      createTaskMock.mockResolvedValue(mockTask);
      mockReq = createMockReq({}, taskData);

      await controller.create(mockReq as Request, mockRes as Response);

      expect(createTaskMock).toHaveBeenCalledWith(taskData, 'testuser');
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockTask);
    });
  });

  describe('update', () => {
    test('should update and return task when found', async () => {
      const updates = {
        title: 'Updated Task',
        done: true
      };

      const mockTask: Task = {
        id: '1',
        title: 'Updated Task',
        done: true,
        userId: 'testuser',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      updateTaskMock.mockResolvedValue(mockTask);
      mockReq = createMockReq({ id: '1' }, updates);

      await controller.update(mockReq as Request, mockRes as Response);

      expect(updateTaskMock).toHaveBeenCalledWith('1', updates, 'testuser');
      expect(mockRes.json).toHaveBeenCalledWith(mockTask);
    });

    test('should return 404 when task not found', async () => {
      updateTaskMock.mockResolvedValue(null);
      mockReq = createMockReq({ id: '1' }, { title: 'Updated Task' });

      await controller.update(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Task not found' });
    });
  });

  describe('delete', () => {
    test('should delete and return 204 when task found', async () => {
      deleteTaskMock.mockResolvedValue(true);
      mockReq = createMockReq({ id: '1' });

      await controller.delete(mockReq as Request, mockRes as Response);

      expect(deleteTaskMock).toHaveBeenCalledWith('1', 'testuser');
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
    });

    test('should return 404 when task not found', async () => {
      deleteTaskMock.mockResolvedValue(false);
      mockReq = createMockReq({ id: '1' });

      await controller.delete(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Task not found' });
    });
  });
});
