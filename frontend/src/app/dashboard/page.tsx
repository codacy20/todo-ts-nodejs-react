'use client';

import { useState, useEffect } from 'react';
import { TaskList } from './components/TaskList';
import { TaskForm } from './components/TaskForm';
import { GroupPanel } from './components/GroupPanel';
import { SettingsPanel } from './components/SettingsPanel';
import { fetchTasks, createTask, updateTask, deleteTask } from './api/tasks';

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

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [showDone, setShowDone] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const groups: string[] = [...new Set(tasks
    .map(task => task.group)
    .filter((group): group is string => typeof group === 'string' && group.length > 0))];

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    let filtered = [...tasks];

    if (selectedGroup) {
      filtered = filtered.filter(task => task.group === selectedGroup);
    }

    if (!showDone) {
      filtered = filtered.filter(task => !task.done);
    }

    setFilteredTasks(filtered);
  }, [tasks, selectedGroup, showDone]);

  async function loadTasks() {
    try {
      setIsLoading(true);
      const fetchedTasks = await fetchTasks();
      setTasks(fetchedTasks);
      setError(null);
    } catch (err) {
      setError('Failed to load tasks');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateTask(task: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
    try {
      const newTask = await createTask(task);
      setTasks(prevTasks => [...prevTasks, newTask]);
      setCurrentTask(null);
    } catch (err) {
      setError('Failed to create task');
      console.error(err);
    }
  }

  async function handleUpdateTask(id: string, updates: Partial<Task>) {
    try {
      const updatedTask = await updateTask(id, updates);
      setTasks(prevTasks =>
        prevTasks.map(task => task.id === id ? updatedTask : task)
      );
      setCurrentTask(null);
    } catch (err) {
      setError('Failed to update task');
      console.error(err);
    }
  }

  async function handleDeleteTask(id: string) {
    try {
      await deleteTask(id);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      if (currentTask?.id === id) {
        setCurrentTask(null);
      }
    } catch (err) {
      setError('Failed to delete task');
      console.error(err);
    }
  }

  function handleToggleTaskStatus(task: Task) {
    handleUpdateTask(task.id, { done: !task.done });
  }

  function handleEditTask(task: Task) {
    setCurrentTask(task);
  }

  function handleCancelEdit() {
    setCurrentTask(null);
  }

  function handleGroupSelect(group: string | null) {
    setSelectedGroup(group);
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Todo Dashboard</h1>
        {error && <div className="error-message">{error}</div>}
      </div>

      <div className="dashboard-content">
        <div className="left-panel">
          <GroupPanel
            groups={groups}
            selectedGroup={selectedGroup}
            onSelectGroup={handleGroupSelect}
          />
          <SettingsPanel />
        </div>

        <div className="main-panel">
          <div className="task-list-controls">
            <button
              className="new-task-btn"
              onClick={() => setCurrentTask({
                id: '',
                title: '',
                done: false,
                userId: '',
                createdAt: new Date(),
                updatedAt: new Date()
              })}
            >
              New Task
            </button>
            <label>
              <input
                type="checkbox"
                checked={showDone}
                onChange={() => setShowDone(!showDone)}
              />
              Show Completed
            </label>
          </div>

          {isLoading ? (
            <div className="loading">Loading tasks...</div>
          ) : (
            <TaskList
              tasks={filteredTasks}
              onToggleStatus={handleToggleTaskStatus}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          )}
        </div>

        {currentTask && (
          <div className="side-panel">
            <TaskForm
              task={currentTask}
              groups={groups}
              onSave={(taskData: Partial<Task>) => {
                if (currentTask.id) {
                  handleUpdateTask(currentTask.id, taskData);
                } else {
                  handleCreateTask(taskData as Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>);
                }
              }}
              onCancel={handleCancelEdit}
              onDelete={currentTask.id ?
                () => handleDeleteTask(currentTask.id) :
                undefined
              }
            />
          </div>
        )}
      </div>

      <style jsx>{`
        .dashboard {
          display: flex;
          flex-direction: column;
          height: 100vh;
          padding: 20px;
        }
        .dashboard-header {
          margin-bottom: 20px;
        }
        .dashboard-content {
          display: flex;
          flex: 1;
          gap: 20px;
        }
        .left-panel {
          width: 200px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .main-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .side-panel {
          width: 300px;
          background: #f5f5f5;
          padding: 15px;
          border-radius: 5px;
        }
        .task-list-controls {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
        }
        .new-task-btn {
          background: #0070f3;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }
        .error-message {
          color: red;
          margin-top: 10px;
        }
        .loading {
          text-align: center;
          padding: 20px;
        }
      `}</style>
    </div>
  );
} 