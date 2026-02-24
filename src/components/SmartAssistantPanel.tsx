import React from 'react';
import { useStore } from '../store/useStore';
import { Sparkles, Check, X, Clock, Tag, ListTree } from 'lucide-react';
import { AiSuggestion } from '../types';

const SmartAssistantPanel: React.FC = () => {
    const tasks = useStore((state) => state.tasks);
    const { acceptSuggestion, rejectSuggestion } = useStore();

    // Extract all pending suggestions across all incomplete tasks
    const pendingSuggestions = tasks
        .filter(t => !t.completed)
        .flatMap(task =>
            task.suggestions
                .filter(s => s.status === 'pending')
                .map(suggestion => ({ suggestion, task }))
        );

    if (pendingSuggestions.length === 0) return null;

    const renderSuggestionIcon = (type: AiSuggestion['type']) => {
        switch (type) {
            case 'time':
            case 'reschedule':
                return <Clock size={16} color="var(--accent-secondary)" />;
            case 'category':
                return <Tag size={16} color="var(--priority-medium)" />;
            case 'subtasks':
                return <ListTree size={16} color="var(--accent-primary)" />;
            default:
                return <Sparkles size={16} color="var(--text-primary)" />;
        }
    };

    return (
        <div className="glass-panel animate-slide-in" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', animationDelay: '0.6s' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', color: 'var(--accent-primary)' }}>
                <Sparkles /> AI Inbox
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {pendingSuggestions.map(({ suggestion, task }) => (
                    <div key={suggestion.id} style={{
                        background: 'rgba(124, 58, 237, 0.1)',
                        border: '1px solid rgba(124, 58, 237, 0.3)',
                        borderRadius: '12px',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                                    Regarding: <strong>{task.title}</strong>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500, fontSize: '0.95rem' }}>
                                    {renderSuggestionIcon(suggestion.type)}
                                    {suggestion.message}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: '8px', alignSelf: 'flex-end', marginTop: '4px' }}>
                            <button
                                onClick={() => rejectSuggestion(task.id, suggestion.id)}
                                className="glass-button"
                                style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--priority-high)', borderColor: 'rgba(255,71,87,0.3)', background: 'rgba(255,71,87,0.1)' }}
                            >
                                <X size={14} /> Ignore
                            </button>
                            <button
                                onClick={() => acceptSuggestion(task.id, suggestion.id)}
                                className="glass-button primary"
                                style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
                            >
                                <Check size={14} /> Accept
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SmartAssistantPanel;
