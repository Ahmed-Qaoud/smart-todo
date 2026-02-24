import { Task } from '../types';
import { isSameDay } from 'date-fns';

export const groupTasksByConstraint = (tasks: Task[]) => {
    const incomplete = tasks.filter(t => !t.completed);

    // Sort by priority (desc)
    const sorted = [...incomplete].sort((a, b) => b.priorityScore - a.priorityScore);

    const highPriority = sorted.filter(t => t.priorityScore > 75);
    const today = sorted.filter(t => t.date && isSameDay(t.date, new Date()) && t.priorityScore <= 75);
    const upcoming = sorted.filter(t => t.date && !isSameDay(t.date, new Date()) && t.priorityScore <= 75);
    const unscheduled = sorted.filter(t => !t.date && t.priorityScore <= 75);

    return { highPriority, today, upcoming, unscheduled };
};

export const detectOverlaps = (tasks: Task[]) => {
    // A simplistic overlap visualization hook
    // It checks tasks with actual times/durations on the same day
    const blocks = tasks
        .filter(t => t.date && t.time && t.durationMinutes && !t.completed)
        .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime());

    // Real implementation would calculate exact overlap minutes
    return blocks;
};
