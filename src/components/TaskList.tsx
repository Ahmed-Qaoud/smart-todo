import React from 'react';
import { useStore } from '../store/useStore';
import TaskItem from './TaskItem';
import { groupTasksByConstraint } from '../utils/scheduling';

const TaskList: React.FC = () => {
    const tasks = useStore((state) => state.tasks);
    const { highPriority, today, upcoming, unscheduled } = groupTasksByConstraint(tasks);

    const renderSection = (title: string, list: any[], color: string) => {
        if (list.length === 0) return null;
        return (
            <div style={{ marginBottom: '24px' }}>
                <h3 style={{
                    fontSize: '1rem',
                    color,
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }}>
                    {title} <span style={{
                        background: 'rgba(255,255,255,0.1)',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        color: 'var(--text-primary)'
                    }}>{list.length}</span>
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {list.map(task => (
                        <TaskItem key={task.id} task={task} />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="glass-panel" style={{ padding: '24px', flex: 1, animationDelay: '0.3s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2>Your Tasks</h2>
                <span style={{ color: 'var(--text-secondary)' }}>{tasks.filter(t => t.completed).length} completed</span>
            </div>

            {tasks.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px 0' }}>
                    No tasks yet. Add one above!
                </p>
            ) : (
                <>
                    {renderSection('High Priority / Focus', highPriority, 'var(--priority-high)')}
                    {renderSection('Today', today, 'var(--accent-secondary)')}
                    {renderSection('Upcoming', upcoming, 'var(--text-secondary)')}
                    {renderSection('Unscheduled', unscheduled, 'var(--text-secondary)')}
                </>
            )}
        </div>
    );
};

export default TaskList;
