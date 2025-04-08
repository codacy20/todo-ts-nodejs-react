'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    username: string;
}

export function SettingsPanel() {
    const [user, setUser] = useState<User | null>(null);
    const [expanded, setExpanded] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const credentials = localStorage.getItem('credentials');

            if (credentials) {
                try {
                    const { username } = JSON.parse(credentials);
                    setUser({ username });
                } catch (e) {
                    console.error('Failed to parse user credentials', e);
                }
            }

        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('credentials');
        router.push('/auth');
    };

    return (
        <div className="settings-panel">
            <div className="panel-header" onClick={() => setExpanded(!expanded)}>
                <h3>Settings</h3>
                <span className={`expand-icon ${expanded ? 'expanded' : ''}`}>
                    ▾
                </span>
            </div>

            {expanded && (
                <div className="panel-content">
                    {user ? (
                        <div className="user-info">
                            <div className="username">
                                Logged in as: <strong>{user.username}</strong>
                            </div>

                            <div className="settings-options">

                                <button
                                    className="logout-btn"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="not-logged-in">
                            Not logged in.
                            <button onClick={() => router.push('/auth')}>
                                Log in
                            </button>
                        </div>
                    )}
                </div>
            )}

            <style jsx>{`
        .settings-panel {
          background: #f5f5f5;
          border-radius: 5px;
          overflow: hidden;
        }
        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          cursor: pointer;
        }
        .panel-header h3 {
          margin: 0;
          font-size: 1rem;
        }
        .expand-icon {
          transition: transform 0.3s;
        }
        .expand-icon.expanded {
          transform: rotate(180deg);
        }
        .panel-content {
          padding: 0 15px 15px;
        }
        .user-info {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .username {
          font-size: 0.9rem;
        }
        .settings-options {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .theme-toggle {
          display: flex;
          align-items: center;
        }
        .theme-toggle label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 0.9rem;
        }
        .logout-btn {
          padding: 8px 0;
          background: #ffeeee;
          color: #cc0000;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          width: 100%;
          margin-top: 5px;
        }
        .not-logged-in {
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: center;
          color: #666;
          font-size: 0.9rem;
        }
        .not-logged-in button {
          padding: 8px 12px;
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
      `}</style>
        </div>
    );
} 