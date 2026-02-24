import React, { useState, useEffect } from 'react';
import { Send, Sparkles, Clock, Calendar } from 'lucide-react';
import { useStore } from '../store/useStore';
import { parseTaskInput } from '../utils/nlpParser';

const TaskInput: React.FC = () => {
    const [input, setInput] = useState('');
    const [preview, setPreview] = useState<any>(null);
    const addTask = useStore((state) => state.addTask);

    useEffect(() => {
        if (input.trim().length > 2) {
            setPreview(parseTaskInput(input));
        } else {
            setPreview(null);
        }
    }, [input]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !preview) return;

        addTask(preview.taskData, preview.suggestions);
        setInput('');
        setPreview(null);
    };

    return (
        <div className="glass-panel" style={{ padding: '24px', animationDelay: '0.2s' }}>
            <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Sparkles
                        size={20}
                        color="var(--accent-secondary)"
                        style={{ position: 'absolute', left: '16px' }}
                    />
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a task organically e.g., 'Team meeting tomorrow 3pm for 1 hour'"
                        style={{
                            width: '100%',
                            padding: '16px 48px',
                            borderRadius: '16px',
                            border: '1px solid var(--glass-border)',
                            background: 'rgba(0,0,0,0.2)',
                            color: 'white',
                            fontSize: '1.1rem',
                            outline: 'none',
                            fontFamily: 'inherit',
                            transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px var(--accent-primary)'}
                        onBlur={(e) => e.target.style.boxShadow = 'none'}
                    />
                    <button
                        type="submit"
                        className="glass-button primary"
                        style={{ position: 'absolute', right: '8px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}
                        disabled={!input.trim()}
                    >
                        Add <Send size={16} />
                    </button>
                </div>
            </form>

            {/* NLP Parsing Preview Panel */}
            {preview && (
                <div
                    className="animate-slide-in"
                    style={{
                        marginTop: '16px',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        display: 'flex',
                        gap: '16px',
                        fontSize: '0.9rem',
                        color: 'var(--text-secondary)'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Sparkles size={14} color="var(--accent-primary)" /> {preview.taskData.category}
                    </div>
                    {preview.taskData.date && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Calendar size={14} color="var(--accent-secondary)" />
                            {preview.taskData.date.toLocaleDateString()}
                        </div>
                    )}
                    {preview.taskData.time && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Clock size={14} color="#2ced71" /> {preview.taskData.time}
                            {preview.taskData.durationMinutes ? ` (${preview.taskData.durationMinutes}m)` : ''}
                        </div>
                    )}
                    {preview.suggestions?.length > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ background: 'rgba(124, 58, 237, 0.2)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem', color: 'var(--accent-primary)' }}>
                                +{preview.suggestions.length} AI Suggestions
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TaskInput;
