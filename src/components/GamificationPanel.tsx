import React from 'react';
import { useStore } from '../store/useStore';
import { Trophy, Flame, Star, Award } from 'lucide-react';

const GamificationPanel: React.FC = () => {
    const stats = useStore((state) => state.stats);

    return (
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                    background: 'var(--accent-gradient)',
                    padding: '12px',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Trophy size={28} color="white" />
                </div>
                <div>
                    <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Level {stats.level}</h2>
                    <p style={{ color: 'var(--accent-secondary)', margin: 0, fontWeight: 600 }}>Master Planner</p>
                </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Star size={18} color="#ffa502" />
                    <span style={{ color: 'var(--text-secondary)' }}>Total XP</span>
                </div>
                <strong style={{ fontSize: '1.2rem' }}>{stats.points} pts</strong>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Flame size={18} color="#ff4757" />
                    <span style={{ color: 'var(--text-secondary)' }}>Current Streak</span>
                </div>
                <strong style={{ fontSize: '1.2rem' }}>{stats.streak} days</strong>
            </div>

            <div>
                <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Award size={16} /> Earned Badges
                </h3>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {stats.badges.map((badge) => (
                        <span key={badge} style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--glass-border)',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '0.85rem'
                        }}>
                            {badge}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GamificationPanel;
