import { describe, test, expect, beforeEach, vi, afterEach } from 'vitest';
import { TaskRepository } from '#@/repositories/task.repository.js';
import { Task } from '#@/interfaces/task.interface.js';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

vi.mock('lowdb');
vi.mock('lowdb/node');

describe('TaskRepository', () => {
    let repository: TaskRepository;

    const mockTasks: Task[] = [
        {
            id: '1',
            title: 'Task 1',
            description: 'Test Task 1',
            done: false,
            userId: 'user1',
            createdAt: new Date('2023-01-01'),
            updatedAt: new Date('2023-01-01')
        },
        {
            id: '2',
            title: 'Task 2',
            description: 'Test Task 2',
            done: true,
            userId: 'user2',
            createdAt: new Date('2023-01-02'),
            updatedAt: new Date('2023-01-02')
        },
        {
            id: '3',
            title: 'Task 3',
            description: 'Test Task 3',
            done: false,
            userId: 'user1',
            createdAt: new Date('2023-01-03'),
            updatedAt: new Date('2023-01-03')
        }
    ];

    const mockRead = vi.fn().mockResolvedValue(undefined);
    const mockWrite = vi.fn().mockResolvedValue(undefined);

    let mockDb: Low<{ tasks: Task[] }>;

    beforeEach(() => {
        const data = { tasks: [...mockTasks] };

        mockDb = {
            data,
            read: mockRead,
            write: mockWrite
        } as unknown as Low<{ tasks: Task[] }>;

        vi.mocked(JSONFile).mockImplementation(() => ({}) as unknown as JSONFile<unknown>);

        vi.mocked(Low<{ tasks: Task[] }>).mockImplementation(() => mockDb);

        repository = new TaskRepository();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('findAll', () => {
        test('should return all tasks for a specific user', async () => {
            const userId = 'user1';

            const result = await repository.findAll(userId);

            expect(mockRead).toHaveBeenCalledTimes(1);
            expect(result).toHaveLength(2);
            expect(result.every(task => task.userId === userId)).toBe(true);
            expect(result[0].id).toBe('1');
            expect(result[1].id).toBe('3');
        });

        test('should return empty array if no tasks found for user', async () => {
            const result = await repository.findAll('nonExistentUser');

            expect(mockRead).toHaveBeenCalledTimes(1);
            expect(result).toHaveLength(0);
        });
    });

    describe('findById', () => {
        test('should return task when found by id and userId', async () => {
            const taskId = '1';
            const userId = 'user1';

            const result = await repository.findById(taskId, userId);

            expect(mockRead).toHaveBeenCalledTimes(1);
            expect(result).not.toBeNull();
            expect(result?.id).toBe(taskId);
            expect(result?.userId).toBe(userId);
        });

        test('should return null when task not found', async () => {
            const result = await repository.findById('nonExistent', 'user1');

            expect(mockRead).toHaveBeenCalledTimes(1);
            expect(result).toBeNull();
        });

        test('should return null when task id found but userId does not match', async () => {
            const result = await repository.findById('1', 'user2');

            expect(mockRead).toHaveBeenCalledTimes(1);
            expect(result).toBeNull();
        });
    });

    describe('create', () => {
        test('should create and return a new task', async () => {
            const newTask: Task = {
                id: '4',
                title: 'New Task',
                description: 'New Task Description',
                done: false,
                userId: 'user1',
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const result = await repository.create(newTask);

            expect(mockRead).toHaveBeenCalledTimes(1);
            expect(mockWrite).toHaveBeenCalledTimes(1);
            expect(mockDb.data.tasks).toHaveLength(4);
            expect(mockDb.data.tasks[3]).toBe(newTask);
            expect(result).toEqual(newTask);
        });
    });

    describe('update', () => {
        test('should update and return task when found', async () => {
            const taskId = '1';
            const userId = 'user1';
            const updates = {
                title: 'Updated Task',
                done: true
            };

            vi.useFakeTimers();
            const now = new Date();
            vi.setSystemTime(now);

            const result = await repository.update(taskId, updates, userId);

            expect(mockRead).toHaveBeenCalledTimes(1);
            expect(mockWrite).toHaveBeenCalledTimes(1);
            expect(result).not.toBeNull();
            expect(result?.title).toBe('Updated Task');
            expect(result?.done).toBe(true);
            expect(result?.updatedAt).toStrictEqual(now);

            const updatedTask = mockDb.data.tasks.find(t => t.id === taskId);
            expect(updatedTask?.title).toBe('Updated Task');
            expect(updatedTask?.done).toBe(true);

            vi.useRealTimers();
        });

        test('should return null when task not found', async () => {
            const result = await repository.update('nonExistent', { title: 'Updated' }, 'user1');

            expect(mockRead).toHaveBeenCalledTimes(1);
            expect(mockWrite).not.toHaveBeenCalled();
            expect(result).toBeNull();
        });

        test('should return null when task id exists but userId does not match', async () => {
            const result = await repository.update('1', { title: 'Updated' }, 'user2');

            expect(mockRead).toHaveBeenCalledTimes(1);
            expect(mockWrite).not.toHaveBeenCalled();
            expect(result).toBeNull();
        });
    });

    describe('delete', () => {
        test('should delete task and return true when task found', async () => {
            const taskId = '1';
            const userId = 'user1';
            const initialLength = mockDb.data.tasks.length;

            const result = await repository.delete(taskId, userId);

            expect(mockRead).toHaveBeenCalledTimes(1);
            expect(mockWrite).toHaveBeenCalledTimes(1);
            expect(result).toBe(true);

            expect(mockDb.data.tasks.length).toBe(initialLength - 1);
            expect(mockDb.data.tasks.find(t => t.id === taskId && t.userId === userId)).toBeUndefined();
        });

        test('should return false when task not found', async () => {
            const initialLength = mockDb.data.tasks.length;

            const result = await repository.delete('nonExistent', 'user1');

            expect(mockRead).toHaveBeenCalledTimes(1);
            expect(mockWrite).toHaveBeenCalledTimes(1);
            expect(result).toBe(false);

            expect(mockDb.data.tasks.length).toBe(initialLength);
        });

        test('should return false and not delete when task id exists but userId does not match', async () => {
            const initialLength = mockDb.data.tasks.length;

            const result = await repository.delete('1', 'user2');

            expect(mockRead).toHaveBeenCalledTimes(1);
            expect(mockWrite).toHaveBeenCalledTimes(1);
            expect(result).toBe(false);

            expect(mockDb.data.tasks.length).toBe(initialLength);
        });
    });
});
