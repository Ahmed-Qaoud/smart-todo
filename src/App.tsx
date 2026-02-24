import React from 'react';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import GamificationPanel from './components/GamificationPanel';
import Timeline from './components/Timeline';
import SmartAssistantPanel from './components/SmartAssistantPanel';
import AnalysisPanel from './components/AnalysisPanel';
import { useSmartReminders } from './hooks/useSmartReminders';

function App() {
    // Initialize background notifications interval
    useSmartReminders();

    return (
        <div className="app-container">
            <div className="main-content">
                <header className="animate-slide-in" style={{ animationDelay: '0.1s' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
                        <span className="text-gradient">Smart</span> To-Do
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Your intelligent, gamified task manager.
                    </p>
                </header>

                <TaskInput />
                <TaskList />
            </div>

            <div className="sidebar">
                <SmartAssistantPanel />
                <AnalysisPanel />
                <GamificationPanel />
                <Timeline />
            </div>
        </div>
    );
}

export default App;
