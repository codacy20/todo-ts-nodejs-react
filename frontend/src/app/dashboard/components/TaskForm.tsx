'use client';

import { useState, useEffect } from 'react';

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

interface TaskFormProps {
  task: Task;
  groups: string[];
  onSave: (task: Partial<Task>) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export function TaskForm({ task, groups, onSave, onCancel, onDelete }: TaskFormProps) {
  const [formData, setFormData] = useState<Partial<Task>>({
    title: '',
    description: '',
    deadline: undefined,
    group: '',
    done: false
  });
  
  useEffect(() => {
    setFormData({
      title: task.title || '',
      description: task.description || '',
      deadline: task.deadline,
      group: task.group || '',
      done: task.done
    });
  }, [task]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData({ ...formData, [name]: checkbox.checked });
    } else if (name === 'deadline') {
      setFormData({ ...formData, [name]: value ? new Date(value) : undefined });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  
  const formatDateForInput = (date?: Date) => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  };
  
  return (
    <div className="task-form">
      <h3>{task.id ? 'Edit Task' : 'New Task'}</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            rows={3}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="deadline">Deadline</label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={formatDateForInput(formData.deadline)}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="group">Group</label>
          <div className="group-input">
            <input
              type="text"
              id="group"
              name="group"
              value={formData.group || ''}
              onChange={handleChange}
              list="group-suggestions"
              placeholder="e.g. Personal, Work"
            />
            <datalist id="group-suggestions">
              {groups.map(group => (
                <option key={group} value={group} />
              ))}
            </datalist>
          </div>
        </div>
        
        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              name="done"
              checked={formData.done}
              onChange={handleChange}
            />
            Mark as done
          </label>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="save-btn">
            {task.id ? 'Update' : 'Create'}
          </button>
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          {onDelete && task.id && (
            <button
              type="button"
              className="delete-btn"
              onClick={() => {
                if (confirm('Are you sure you want to delete this task?')) {
                  onDelete();
                }
              }}
            >
              Delete
            </button>
          )}
        </div>
      </form>
      
      <style jsx>{`
        .task-form {
          padding: 15px;
        }
        .task-form h3 {
          margin-top: 0;
          margin-bottom: 15px;
        }
        .form-group {
          margin-bottom: 15px;
        }
        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
        }
        .form-group input[type="text"],
        .form-group input[type="date"],
        .form-group textarea {
          width: 100%;
          padding: 8px 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }
        .form-group textarea {
          resize: vertical;
        }
        .form-group.checkbox {
          display: flex;
          align-items: center;
        }
        .form-group.checkbox label {
          display: flex;
          align-items: center;
          gap: 5px;
          cursor: pointer;
        }
        .form-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }
        .save-btn, .cancel-btn, .delete-btn {
          padding: 8px 15px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.95rem;
        }
        .save-btn {
          background: #0070f3;
          color: white;
        }
        .cancel-btn {
          background: #f0f0f0;
        }
        .delete-btn {
          background: #ffeeee;
          color: #cc0000;
          margin-left: auto;
        }
      `}</style>
    </div>
  );
} 