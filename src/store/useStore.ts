import { create } from 'zustand';
import { Task, UserStats, Subtask, AiSuggestion, DailySummary } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { addDays, setHours, setMinutes, isToday } from 'date-fns';

interface AppState {
    tasks: Task[];
    stats: UserStats;
    addTask: (task: Omit<Task, 'id' | 'createdAt' | 'suggestions'>, suggestions: Omit<AiSuggestion, 'id' | 'taskId' | 'status'>[]) => void;
    editTask: (id: string, updates: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    toggleTaskCompletion: (id: string) => void;
    toggleSubtaskCompletion: (taskId: string, subtaskId: string) => void;
    updateStats: (pointsToAdd: number) => void;
    acceptSuggestion: (taskId: string, suggestionId: string) => void;
    rejectSuggestion: (taskId: string, suggestionId: string) => void;
    getDailySummary: () => DailySummary;
}

const initialDate = setMinutes(setHours(addDays(new Date(), 1), 14), 0); // Tomorrow at 2 PM

const initialTasks: Task[] = [
    {
        id: uuidv4(),
        title: 'Prepare presentation for marketing team tomorrow for 2 hours',
        description: 'Prepare presentation for marketing team',
        date: initialDate,
        time: '14:00',
        durationMinutes: 120,
        category: 'Work',
        priorityScore: 85,
        subtasks: [
            { id: uuidv4(), title: 'Create slide deck outline', completed: false },
            { id: uuidv4(), title: 'Add graphics and charts', completed: false },
            { id: uuidv4(), title: 'Review with manager', completed: false }
        ],
        suggestions: [],
        completed: false,
        createdAt: new Date(),
    },
    {
        id: uuidv4(),
        title: 'Yoga tonight for 30 mins',
        description: 'Yoga',
        date: new Date(),
        time: '20:00',
        durationMinutes: 30,
        category: 'Fitness',
        priorityScore: 30,
        subtasks: [],
        suggestions: [
            {
                id: uuidv4(),
                taskId: 'temp',
                type: 'time',
                message: 'You usually do Yoga at 18:00, want to reschedule?',
                data: '18:00',
                status: 'pending'
            }
        ],
        completed: false,
        createdAt: new Date(),
    }
];

export const useStore = create<AppState>((set, get) => ({
    tasks: initialTasks,
    stats: {
        points: 150,
        streak: 3,
        level: 2,
        badges: ['Early Bird', 'Task Master'],
    },

    addTask: (taskData, suggestions = []) => {
        const taskId = uuidv4();
        const mappedSuggestions: AiSuggestion[] = suggestions.map(s => ({
            ...s,
            id: uuidv4(),
            taskId,
            status: 'pending' as const
        }));

        set((state) => ({
            tasks: [...state.tasks, { ...taskData, id: taskId, suggestions: mappedSuggestions, createdAt: new Date() }],
        }));
    },

    editTask: (id, updates) => {
        set((state) => ({
            tasks: state.tasks.map(task => task.id === id ? { ...task, ...updates } : task)
        }));
    },

    deleteTask: (id) => {
        set((state) => ({
            tasks: state.tasks.filter(task => task.id !== id)
        }));
    },

    toggleTaskCompletion: (id) => {
        set((state) => {
            const updatedTasks = state.tasks.map((task) => {
                if (task.id === id) {
                    return { ...task, completed: !task.completed };
                }
                return task;
            });
            return { tasks: updatedTasks };
        });
    },

    toggleSubtaskCompletion: (taskId, subtaskId) => {
        set((state) => {
            const updatedTasks = state.tasks.map((task) => {
                if (task.id === taskId) {
                    const updatedSubtasks = task.subtasks.map((sub) =>
                        sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
                    );
                    return { ...task, subtasks: updatedSubtasks };
                }
                return task;
            });
            return { tasks: updatedTasks };
        });
    },

    updateStats: (pointsToAdd) => {
        set((state) => {
            const newPoints = state.stats.points + pointsToAdd;
            const newLevel = Math.floor(newPoints / 100) + 1;

            return {
                stats: {
                    ...state.stats,
                    points: newPoints,
                    level: newLevel,
                }
            };
        });
    },

    acceptSuggestion: (taskId, suggestionId) => {
        set((state) => {
            const updatedTasks = state.tasks.map((task) => {
                if (task.id === taskId) {
                    const suggestion = task.suggestions.find(s => s.id === suggestionId);
                    if (!suggestion || suggestion.status !== 'pending') return task;

                    let updatedTask = { ...task };

                    if (suggestion.type === 'subtasks') {
                        updatedTask.subtasks = [...updatedTask.subtasks, ...suggestion.data];
                    } else if (suggestion.type === 'category') {
                        updatedTask.category = suggestion.data;
                    } else if (suggestion.type === 'time' || suggestion.type === 'reschedule') {
                        updatedTask.time = suggestion.data;
                    }

                    const updatedSuggestions = task.suggestions.map(s =>
                        s.id === suggestionId ? { ...s, status: 'accepted' as const } : s
                    );

                    return { ...updatedTask, suggestions: updatedSuggestions };
                }
                return task;
            });
            return { tasks: updatedTasks };
        });
    },

    rejectSuggestion: (taskId, suggestionId) => {
        set((state) => {
            const updatedTasks = state.tasks.map((task) => {
                if (task.id === taskId) {
                    const updatedSuggestions = task.suggestions.map(s =>
                        s.id === suggestionId ? { ...s, status: 'rejected' as const } : s
                    );
                    return { ...task, suggestions: updatedSuggestions };
                }
                return task;
            });
            return { tasks: updatedTasks };
        });
    },

    getDailySummary: () => {
        const state = get();
        const todaysTasks = state.tasks.filter(t => t.date && isToday(t.date));

        const totalTasks = todaysTasks.length;
        const completedTasks = todaysTasks.filter(t => t.completed).length;
        const pendingTasks = totalTasks - completedTasks;

        const timeSpentMinutes = todaysTasks
            .filter(t => t.completed && t.durationMinutes)
            .reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);

        const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

        // Calculate Category Breakdown (PieChart)
        const categoryMap = new Map<string, number>();
        todaysTasks.filter(t => t.completed).forEach(t => {
            const time = t.durationMinutes || 30; // Default 30 mins if not specified
            categoryMap.set(t.category, (categoryMap.get(t.category) || 0) + time);
        });
        const categoryBreakdown = Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }));

        // Calculate peak productivity hours (BarChart)
        const hourlyMap = new Map<string, number>();
        todaysTasks.filter(t => t.completed && t.time).forEach(t => {
            // Extract just the hour part (e.g., '14:00' -> '14')
            const hour = t.time!.split(':')[0] + ':00';
            hourlyMap.set(hour, (hourlyMap.get(hour) || 0) + 1);
        });

        // Ensure standard work hours exist in data even if empty
        const defaultHours = ['09:00', '12:00', '15:00', '18:00'];
        defaultHours.forEach(h => {
            if (!hourlyMap.has(h)) hourlyMap.set(h, 0);
        });

        const hourlyCompletion = Array.from(hourlyMap.entries())
            .map(([hour, count]) => ({ hour, count }))
            .sort((a, b) => parseInt(a.hour) - parseInt(b.hour)); // Sort chronologically

        return {
            completedTasks,
            pendingTasks,
            totalTasks,
            timeSpentMinutes,
            completionRate,
            categoryBreakdown,
            hourlyCompletion
        };
    }
}));
