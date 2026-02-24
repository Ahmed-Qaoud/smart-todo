import React from 'react';
import { useStore } from '../store/useStore';
import { Activity, CheckCircle, Clock, Target, TrendingUp, BarChart2 } from 'lucide-react';

const AnalysisPanel: React.FC = () => {
    const { getDailySummary } = useStore();
    const summary = getDailySummary();

    const getMotivationMessage = (rate: number) => {
        if (summary.totalTasks === 0) return "Add some tasks to start your day!";
        if (rate === 100) return "Incredible! You crushed your day! 🌟";
        if (rate >= 75) return "You're on fire! Almost there! 🔥";
        if (rate >= 50) return "Halfway through! Keep going! 🚀";
        return "You've got this! Start small.";
    };

    // Mock data for the last 6 days, and today's actual data
    const mockTrends = [45, 60, 30, 80, 75, 90, summary.completionRate];

    return (
        <div className="glass-panel animate-slide-in" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', animationDelay: '0.6s' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <Activity color="var(--accent-secondary)" /> Daily Progress
            </h2>

            {/* Motivational Message */}
            <div style={{
                background: 'rgba(0, 240, 255, 0.1)',
                border: '1px solid rgba(0, 240, 255, 0.3)',
                borderRadius: '12px',
                padding: '12px',
                marginBottom: '24px',
                textAlign: 'center',
                color: 'var(--accent-secondary)',
                fontWeight: 500,
                fontSize: '0.95rem'
            }}>
                {getMotivationMessage(summary.completionRate)}
            </div>

            {/* Progress Bar Container */}
            <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Completion Rate</span>
                    <strong style={{ color: 'var(--accent-secondary)' }}>{summary.completionRate}%</strong>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.1)', height: '12px', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{
                        height: '100%',
                        width: `${summary.completionRate}%`,
                        background: 'var(--accent-gradient)',
                        transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 0 10px var(--accent-glow)'
                    }} />
                </div>
            </div>

            {/* Stat Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={24} color="var(--priority-low)" />
                    <span style={{ fontSize: '1.5rem', fontWeight: 600 }}>{summary.completedTasks}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Completed</span>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <Target size={24} color="var(--priority-medium)" />
                    <span style={{ fontSize: '1.5rem', fontWeight: 600 }}>{summary.pendingTasks}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Pending</span>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', gridColumn: 'span 2' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        <Clock size={16} /> Total Time Invested
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <TrendingUp size={20} />
                        {summary.timeSpentMinutes} mins
                    </div>
                </div>
            </div>

            {/* 7-Day Trend SVG Chart */}
            <div style={{ marginTop: '24px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>
                    <BarChart2 size={16} /> 7-Day Completion Trend
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '100px', gap: '8px' }}>
                    {mockTrends.map((rate, index) => {
                        const isToday = index === mockTrends.length - 1;
                        return (
                            <div key={index} style={{
                                width: '100%',
                                height: `${Math.max(rate, 5)}%`, // Minimum 5% height to show a small bar
                                background: isToday ? 'var(--accent-gradient)' : 'rgba(255,255,255,0.1)',
                                borderRadius: '4px',
                                transition: 'height 0.5s ease',
                                position: 'relative'
                            }}>
                                {/* Tooltip on hover */}
                                <div style={{
                                    position: 'absolute',
                                    top: '-24px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    fontSize: '0.7rem',
                                    background: 'rgba(0,0,0,0.8)',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    opacity: 0,
                                    pointerEvents: 'none',
                                    color: 'white'
                                }}>
                                    {rate}%
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                    <span>6 days ago</span>
                    <span>Today</span>
                </div>
            </div>

        </div>
    );
};

export default AnalysisPanel;
