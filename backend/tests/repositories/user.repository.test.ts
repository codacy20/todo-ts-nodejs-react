import { describe, test, expect, beforeEach, vi, afterEach } from 'vitest';
import { UserRepositoryImpl } from '#@/repositories/user.repository.js';
import { User } from '#@/interfaces/user.interface.js';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

vi.mock('lowdb');
vi.mock('lowdb/node');

describe('UserRepository', () => {
    let repository: UserRepositoryImpl;

    const mockUsers: User[] = [
        {
            username: 'user1',
            passwordHash: 'hash1'
        },
        {
            username: 'user2',
            passwordHash: 'hash2'
        },
        {
            username: 'user3',
            passwordHash: 'hash3'
        }
    ];

    const mockRead = vi.fn().mockResolvedValue(undefined);
    const mockWrite = vi.fn().mockResolvedValue(undefined);

    let mockDb: {
        data: { users: User[] } | null | Record<string, unknown>;
        read: ReturnType<typeof vi.fn>;
        write: ReturnType<typeof vi.fn>;
    };

    beforeEach(() => {
        const data = { users: [...mockUsers] };

        mockDb = {
            data,
            read: mockRead,
            write: mockWrite
        };

        vi.mocked(JSONFile).mockImplementation(() => ({}) as unknown as JSONFile<unknown>);
        vi.mocked(Low).mockImplementation(() => mockDb as unknown as Low<unknown>);

        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('findUserByUsername', () => {
        test('should return user when found by username', async () => {
            repository = new UserRepositoryImpl();
            vi.clearAllMocks();

            const username = 'user1';
            const result = await repository.findUserByUsername(username);

            expect(mockRead).toHaveBeenCalledTimes(1);
            expect(result).not.toBeNull();
            expect(result?.username).toBe(username);
            expect(result?.passwordHash).toBe('hash1');
        });

        test('should return null when user not found', async () => {
            repository = new UserRepositoryImpl();
            vi.clearAllMocks();

            const result = await repository.findUserByUsername('nonExistentUser');

            expect(mockRead).toHaveBeenCalledTimes(1);
            expect(result).toBeNull();
        });
    });

    describe('createUser', () => {
        test('should create and return a new user', async () => {
            repository = new UserRepositoryImpl();
            vi.clearAllMocks();

            const newUser: User = {
                username: 'newUser',
                passwordHash: 'newHash'
            };

            const result = await repository.createUser(newUser);

            expect(mockRead).toHaveBeenCalledTimes(1);
            expect(mockWrite).toHaveBeenCalledTimes(1);

            const typedData = mockDb.data as { users: User[] };
            expect(typedData.users).toHaveLength(4);
            expect(typedData.users[3]).toBe(newUser);
            expect(result).toEqual(newUser);
        });
    });
});
