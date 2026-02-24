export interface Subtask {
    id: string;
    title: string;
    completed: boolean;
}

export interface AiSuggestion {
    id: string;
    taskId: string;
    type: 'subtasks' | 'category' | 'time' | 'reschedule';
    message: string;
    data: any; // Context-dependent data (e.g., array of subtasks, string category, or Date mapping)
    status: 'pending' | 'accepted' | 'rejected';
}

export interface Task {
    id: string;
    title: string; // Original input
    description: string; // Parsed description
    date: Date | null;
    time: string | null;
    durationMinutes: number | null;
    reminderOffsetMinutes?: number; // 0, 10, 30, 60, etc.
    category: string;
    priorityScore: number;
    subtasks: Subtask[];
    suggestions: AiSuggestion[];
    completed: boolean;
    createdAt: Date;
}

export interface UserStats {
    points: number;
    streak: number;
    level: number;
    badges: string[];
}

export interface DailySummary {
    completedTasks: number;
    pendingTasks: number;
    totalTasks: number;
    timeSpentMinutes: number;
    completionRate: number;
    categoryBreakdown: { name: string; value: number }[];
    hourlyCompletion: { hour: string; count: number }[];
}
