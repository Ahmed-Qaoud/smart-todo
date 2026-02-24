import React, { useState } from 'react';
import { Task } from '../types';
import { useStore } from '../store/useStore';
import { Clock, Tag, ChevronDown, ChevronUp, CheckCircle2, Circle, Trash2, Edit2, X, Check, Bell } from 'lucide-react';
import { triggerCompletionConfetti, calculatePointsForTask } from '../utils/gamification';

interface Props {
    task: Task;
}

const TaskItem: React.FC<Props> = ({ task }) => {
    const [expanded, setExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(task.description);

    const { toggleTaskCompletion, toggleSubtaskCompletion, updateStats, deleteTask, editTask } = useStore();

    const handleComplete = () => {
        if (!task.completed) {
            triggerCompletionConfetti();
            const points = calculatePointsForTask(task.priorityScore, task.subtasks.length > 0);
            updateStats(points);
        }
        toggleTaskCompletion(task.id);
    };

    const getPriorityColor = () => {
        if (task.priorityScore > 75) return 'var(--priority-high)';
        if (task.priorityScore > 40) return 'var(--priority-medium)';
        return 'var(--priority-low)';
    };

    const handleSaveEdit = () => {
        if (editValue.trim() !== '') {
            editTask(task.id, { description: editValue });
        }
        setIsEditing(false);
    };

    return (
        <div style={{
            background: 'rgba(0,0,0,0.15)',
            border: '1px solid var(--glass-border)',
            borderLeft: `4px solid ${getPriorityColor()}`,
            borderRadius: '12px',
            padding: '16px',
            transition: 'all 0.2s ease',
            opacity: task.completed ? 0.6 : 1,
            transform: task.completed ? 'scale(0.98)' : 'scale(1)'
        }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>

                {/* Checkbox */}
                <button
                    onClick={handleComplete}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: task.completed ? 'var(--accent-primary)' : 'var(--text-secondary)',
                        marginTop: '2px'
                    }}
                >
                    {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </button>

                {/* Content */}
                <div style={{ flex: 1 }}>
                    {isEditing ? (
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                            <input
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                style={{
                                    flex: 1,
                                    background: 'rgba(0,0,0,0.3)',
                                    border: '1px solid var(--accent-primary)',
                                    color: 'white',
                                    padding: '4px 8px',
                                    borderRadius: '6px',
                                    outline: 'none',
                                    fontFamily: 'inherit'
                                }}
                                autoFocus
                            />
                            <button onClick={handleSaveEdit} className="glass-button" style={{ padding: '4px 8px' }}><Check size={16} color="var(--priority-low)" /></button>
                            <button onClick={() => setIsEditing(false)} className="glass-button" style={{ padding: '4px 8px' }}><X size={16} color="var(--priority-high)" /></button>
                        </div>
                    ) : (
                        <h3 style={{
                            margin: '0 0 8px 0',
                            fontSize: '1.1rem',
                            textDecoration: task.completed ? 'line-through' : 'none',
                            color: task.completed ? 'var(--text-secondary)' : 'var(--text-primary)'
                        }}>
                            {task.description}
                        </h3>
                    )}

                    <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Tag size={14} /> {task.category}
                        </span>
                        {(task.time || task.durationMinutes) && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Clock size={14} />
                                {task.time ? `${task.time}` : ''}
                                {task.durationMinutes ? ` (${task.durationMinutes}m)` : ''}
                            </span>
                        )}
                        {task.time && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }} title="Reminder Settings">
                                <Bell size={14} color={task.reminderOffsetMinutes ? 'var(--accent-secondary)' : 'var(--text-secondary)'} />
                                <select
                                    value={task.reminderOffsetMinutes || ''}
                                    onChange={(e) => editTask(task.id, { reminderOffsetMinutes: e.target.value ? Number(e.target.value) : undefined })}
                                    onClick={(e) => e.stopPropagation()}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: task.reminderOffsetMinutes ? 'var(--accent-secondary)' : 'var(--text-secondary)',
                                        fontSize: '0.85rem',
                                        outline: 'none',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <option value="" style={{ background: 'var(--bg-color)' }}>No Reminder</option>
                                    <option value="10" style={{ background: 'var(--bg-color)' }}>10 mins before</option>
                                    <option value="30" style={{ background: 'var(--bg-color)' }}>30 mins before</option>
                                    <option value="60" style={{ background: 'var(--bg-color)' }}>1 hour before</option>
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="glass-button"
                        style={{ padding: '6px', borderRadius: '8px', background: 'transparent', border: 'none', color: 'var(--text-secondary)' }}
                        title="Edit Task"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={() => deleteTask(task.id)}
                        className="glass-button"
                        style={{ padding: '6px', borderRadius: '8px', background: 'transparent', border: 'none', color: 'var(--text-secondary)' }}
                        title="Delete Task"
                    >
                        <Trash2 size={16} />
                    </button>
                    {task.subtasks.length > 0 && (
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="glass-button"
                            style={{ padding: '6px', borderRadius: '8px' }}
                        >
                            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                    )}
                </div>
            </div>

            {/* Subtasks Container */}
            {expanded && task.subtasks.length > 0 && (
                <div style={{
                    marginTop: '16px',
                    marginLeft: '40px',
                    paddingLeft: '16px',
                    borderLeft: '2px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                }}>
                    {task.subtasks.map(sub => (
                        <div key={sub.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <button
                                onClick={() => toggleSubtaskCompletion(task.id, sub.id)}
                                style={{
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    color: sub.completed ? 'var(--accent-secondary)' : 'var(--text-secondary)'
                                }}
                            >
                                {sub.completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                            </button>
                            <span style={{
                                fontSize: '0.95rem',
                                textDecoration: sub.completed ? 'line-through' : 'none',
                                color: sub.completed ? 'var(--text-secondary)' : 'var(--text-primary)'
                            }}>
                                {sub.title}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TaskItem;
