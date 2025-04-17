'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    
    useEffect(() => {
        const credentials = localStorage.getItem('credentials');
        if (credentials) {
            router.push('/dashboard');
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const endpoint = isLogin ? '/login' : '/register';
            const response = await fetch(`http://localhost:3000/users${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Authentication failed');
            }

            // After successful registration, automatically log in
            if (!isLogin) {
                const loginResponse = await fetch('http://localhost:3000/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                });

                if (!loginResponse.ok) {
                    throw new Error('Registration successful but login failed');
                }
            }

            localStorage.setItem('credentials', JSON.stringify({ username, password }));
            router.push('/dashboard');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>{isLogin ? 'Login' : 'Register'}</h1>

                {error && <p className="error-message">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    <button type="submit" className="submit-btn" disabled={isLoading}>
                        {isLoading ? 'Loading...' : (isLogin ? 'Login' : 'Register')}
                    </button>
                </form>

                {!isLogin && (
                    <p className="auth-note">
                        Note: This is a demo app. Registration is simulated.
                    </p>
                )}

                <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="toggle-auth-btn"
                >
                    {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
                </button>
            </div>
            
            <style jsx>{`
                .auth-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    padding: 20px;
                }
                .auth-card {
                    background: var(--card-bg);
                    border-radius: 8px;
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
                    padding: 30px;
                    width: 100%;
                    max-width: 400px;
                }
                h1 {
                    margin-bottom: 20px;
                    text-align: center;
                }
                .error-message {
                    color: var(--danger-color);
                    margin-bottom: 20px;
                    padding: 10px;
                    background: var(--danger-light);
                    border-radius: 4px;
                    text-align: center;
                }
                .form-group {
                    margin-bottom: 15px;
                }
                label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: 500;
                }
                input {
                    width: 100%;
                    padding: 10px;
                    border-radius: 4px;
                    border: 1px solid var(--border-color);
                }
                .submit-btn {
                    width: 100%;
                    padding: 12px;
                    background: var(--primary-color);
                    color: white;
                    border: none;
                    border-radius: 4px;
                    font-size: 1rem;
                    margin-top: 10px;
                    cursor: pointer;
                }
                .submit-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
                .toggle-auth-btn {
                    margin-top: 15px;
                    background: none;
                    border: none;
                    color: var(--primary-color);
                    cursor: pointer;
                    text-align: center;
                    width: 100%;
                    font-size: 0.9rem;
                }
                .auth-note {
                    margin-top: 15px;
                    color: var(--muted-text);
                    font-size: 0.9rem;
                    text-align: center;
                }
            `}</style>
        </div>
    );
}