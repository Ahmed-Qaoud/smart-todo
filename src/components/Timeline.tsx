import React from 'react';
import { useStore } from '../store/useStore';
import { detectOverlaps } from '../utils/scheduling';
import { CalendarRange } from 'lucide-react';

const Timeline: React.FC = () => {
    const tasks = useStore((state) => state.tasks);
    const scheduledBlocks = detectOverlaps(tasks);

    return (
        <div className="glass-panel" style={{ padding: '24px', flex: 1, animationDelay: '0.5s', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <CalendarRange color="var(--accent-primary)" /> Daily Timeline
            </h2>

            {scheduledBlocks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
                    <p>No time-blocked tasks.</p>
                    <p style={{ fontSize: '0.9rem' }}>Add a time to your tasks to see them here.</p>
                </div>
            ) : (
                <div style={{
                    position: 'relative',
                    borderLeft: '2px solid rgba(255,255,255,0.1)',
                    marginLeft: '12px',
                    paddingLeft: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px'
                }}>
                    {scheduledBlocks.map((task) => (
                        <div key={task.id} style={{ position: 'relative' }}>
                            {/* Timeline Dot */}
                            <div style={{
                                position: 'absolute',
                                left: '-27px',
                                top: '4px',
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                background: 'var(--accent-primary)',
                                boxShadow: '0 0 10px var(--accent-glow)'
                            }} />

                            <div style={{ color: 'var(--accent-secondary)', fontWeight: 600, fontSize: '0.95rem', marginBottom: '4px' }}>
                                {task.time} {task.durationMinutes ? `(${task.durationMinutes}m)` : ''}
                            </div>
                            <div style={{
                                background: 'rgba(0,0,0,0.2)',
                                padding: '12px',
                                borderRadius: '8px',
                                borderLeft: `3px solid var(--accent-primary)`
                            }}>
                                <div style={{ fontWeight: 500 }}>{task.description}</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                    {task.category}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Timeline;
