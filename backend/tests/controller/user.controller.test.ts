import { describe, test, expect, beforeEach, vi } from 'vitest';
import { UserController } from '#@/controllers/user.controller.js';
import { Request, Response } from 'express';
import { User } from '#@/interfaces/user.interface.js';
import { UserService } from '#@/services/user.service.js';
import { UserModel } from '#@/models/user.model.js';

const createUserMock = vi.fn();
const validateUserMock = vi.fn();

const mockUserService = {
    createUser: createUserMock,
    validateUser: validateUserMock,
} as unknown as UserService;

const createMockReq = (params = {}, body = {}): Partial<Request> => ({
    params,
    body,
});

const createMockRes = (): Partial<Response> => {
    const res: Partial<Response> = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
        send: vi.fn().mockReturnThis(),
    };
    return res;
};

describe('UserController', () => {
    let controller: UserController;
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;

    beforeEach(() => {
        controller = new UserController(mockUserService);
        mockRes = createMockRes();
        vi.clearAllMocks();
    });

    describe('register', () => {
        test('should register a new user successfully', async () => {
            const userData = {
                username: 'testuser',
                password: 'password123'
            };

            const mockUser = new UserModel('testuser', 'hashedpassword');

            createUserMock.mockResolvedValue(mockUser);
            mockReq = createMockReq({}, userData);

            await controller.register(mockReq as Request, mockRes as Response);

            expect(createUserMock).toHaveBeenCalledWith('testuser', 'password123');
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'User created successfully',
                username: 'testuser'
            });
        });

        test('should return 400 when username or password is missing', async () => {
            mockReq = createMockReq({}, { username: 'testuser' });

            await controller.register(mockReq as Request, mockRes as Response);

            expect(createUserMock).not.toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Username and password are required' });

            vi.clearAllMocks();
            mockRes = createMockRes();
            mockReq = createMockReq({}, { password: 'password123' });

            await controller.register(mockReq as Request, mockRes as Response);

            expect(createUserMock).not.toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Username and password are required' });
        });

        test('should return 400 when username already exists', async () => {
            const userData = {
                username: 'existinguser',
                password: 'password123'
            };

            createUserMock.mockRejectedValue(new Error('Username already exists'));
            mockReq = createMockReq({}, userData);

            await controller.register(mockReq as Request, mockRes as Response);

            expect(createUserMock).toHaveBeenCalledWith('existinguser', 'password123');
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Username already exists' });
        });

        test('should return 500 when an unknown error occurs', async () => {
            const userData = {
                username: 'testuser',
                password: 'password123'
            };

            createUserMock.mockRejectedValue('Some unknown error');
            mockReq = createMockReq({}, userData);

            await controller.register(mockReq as Request, mockRes as Response);

            expect(createUserMock).toHaveBeenCalledWith('testuser', 'password123');
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Internal server error' });
        });
    });

    describe('login', () => {
        test('should login user successfully', async () => {
            const userData = {
                username: 'testuser',
                password: 'password123'
            };

            validateUserMock.mockResolvedValue(true);
            mockReq = createMockReq({}, userData);

            await controller.login(mockReq as Request, mockRes as Response);

            expect(validateUserMock).toHaveBeenCalledWith('testuser', 'password123');
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Login successful' });
        });

        test('should return 400 when username or password is missing', async () => {
            mockReq = createMockReq({}, { username: 'testuser' });

            await controller.login(mockReq as Request, mockRes as Response);

            expect(validateUserMock).not.toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Username and password are required' });

            vi.clearAllMocks();
            mockRes = createMockRes();
            mockReq = createMockReq({}, { password: 'password123' });

            await controller.login(mockReq as Request, mockRes as Response);

            expect(validateUserMock).not.toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Username and password are required' });
        });

        test('should return 401 when credentials are invalid', async () => {
            const userData = {
                username: 'testuser',
                password: 'wrongpassword'
            };

            validateUserMock.mockResolvedValue(false);
            mockReq = createMockReq({}, userData);

            await controller.login(mockReq as Request, mockRes as Response);

            expect(validateUserMock).toHaveBeenCalledWith('testuser', 'wrongpassword');
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
        });

        test('should return 500 when an error occurs', async () => {
            const userData = {
                username: 'testuser',
                password: 'password123'
            };

            validateUserMock.mockRejectedValue(new Error('Database error'));
            mockReq = createMockReq({}, userData);

            await controller.login(mockReq as Request, mockRes as Response);

            expect(validateUserMock).toHaveBeenCalledWith('testuser', 'password123');
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Internal server error' });
        });
    });
});
