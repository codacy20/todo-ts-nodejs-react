'use client';

interface GroupPanelProps {
  groups: string[];
  selectedGroup: string | null;
  onSelectGroup: (group: string | null) => void;
}

export function GroupPanel({ groups, selectedGroup, onSelectGroup }: GroupPanelProps) {
  return (
    <div className="group-panel">
      <h3>Task Groups</h3>
      
      <div className="group-list">
        <div 
          className={`group-item ${selectedGroup === null ? 'active' : ''}`}
          onClick={() => onSelectGroup(null)}
        >
          All Tasks
        </div>
        
        {groups.length === 0 ? (
          <div className="no-groups">No groups yet</div>
        ) : (
          groups.map(group => (
            <div 
              key={group}
              className={`group-item ${selectedGroup === group ? 'active' : ''}`}
              onClick={() => onSelectGroup(group)}
            >
              {group}
            </div>
          ))
        )}
      </div>
      
      <style jsx>{`
        .group-panel {
          background: #f5f5f5;
          border-radius: 5px;
          padding: 15px;
        }
        h3 {
          margin-top: 0;
          margin-bottom: 15px;
          font-size: 1rem;
        }
        .group-list {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .group-item {
          padding: 8px 12px;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .group-item:hover {
          background-color: #e0e0e0;
        }
        .group-item.active {
          background-color: #0070f3;
          color: white;
        }
        .no-groups {
          padding: 8px 12px;
          color: #888;
          font-style: italic;
        }
      `}</style>
    </div>
  );
} 