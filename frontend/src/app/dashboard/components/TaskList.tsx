'use client';

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

interface TaskListProps {
  tasks: Task[];
  onToggleStatus: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskList({ tasks, onToggleStatus, onEdit, onDelete }: TaskListProps) {
  const groupedTasks: Record<string, Task[]> = {};

  tasks.forEach(task => {
    const group = task.group || 'Uncategorized';
    if (!groupedTasks[group]) {
      groupedTasks[group] = [];
    }
    groupedTasks[group].push(task);
  });

  const formatDate = (date?: Date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="task-list">
      {Object.entries(groupedTasks).length === 0 ? (
        <div className="no-tasks">No tasks found</div>
      ) : (
        Object.entries(groupedTasks).map(([group, groupTasks]) => (
          <div key={group} className="task-group">
            <h3 className="group-title">{group}</h3>
            <div className="tasks">
              {groupTasks.map(task => (
                <div key={task.id} className={`task-item ${task.done ? 'done' : ''}`}>
                  <div className="task-status">
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={() => onToggleStatus(task)}
                    />
                  </div>
                  <div className="task-content" onClick={() => onEdit(task)}>
                    <div className="task-title">{task.title}</div>
                    {task.deadline && (
                      <div className="task-deadline">
                        Due: {formatDate(task.deadline)}
                      </div>
                    )}
                  </div>
                  <div className="task-actions">
                    <button
                      className="edit-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(task);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Are you sure you want to delete this task?')) {
                          onDelete(task.id);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      <style jsx>{`
        .task-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .task-group {
          border: 1px solid #eaeaea;
          border-radius: 5px;
          overflow: hidden;
        }
        .group-title {
          background: #f5f5f5;
          margin: 0;
          padding: 10px 15px;
          font-size: 1rem;
          border-bottom: 1px solid #eaeaea;
        }
        .tasks {
          display: flex;
          flex-direction: column;
        }
        .task-item {
          display: flex;
          align-items: center;
          padding: 12px 15px;
          border-bottom: 1px solid #eaeaea;
          transition: background-color 0.2s;
        }
        .task-item:last-child {
          border-bottom: none;
        }
        .task-item:hover {
          background-color: #f9f9f9;
        }
        .task-item.done .task-title {
          text-decoration: line-through;
          color: #888;
        }
        .task-status {
          margin-right: 10px;
        }
        .task-content {
          flex: 1;
          cursor: pointer;
        }
        .task-title {
          font-weight: 500;
        }
        .task-deadline {
          font-size: 0.85rem;
          color: #666;
          margin-top: 3px;
        }
        .task-actions {
          display: flex;
          gap: 5px;
        }
        .edit-btn, .delete-btn {
          padding: 5px 10px;
          border: none;
          border-radius: 3px;
          cursor: pointer;
          font-size: 0.85rem;
        }
        .edit-btn {
          background: #f0f0f0;
        }
        .delete-btn {
          background: #ffeeee;
          color: #cc0000;
        }
        .no-tasks {
          text-align: center;
          padding: 20px;
          color: #666;
        }
      `}</style>
    </div>
  );
} 