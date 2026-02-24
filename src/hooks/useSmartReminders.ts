import { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { isToday, parse, differenceInMinutes, isPast } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { AiSuggestion } from '../types';

export const useSmartReminders = () => {
    const { tasks } = useStore();
    const notifiedTasks = useRef<Set<string>>(new Set());
    const rescheduledTasks = useRef<Set<string>>(new Set());

    useEffect(() => {
        // Request permission for notifications if not granted
        if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
            Notification.requestPermission();
        }

        const checkReminders = () => {
            const now = new Date();

            tasks.forEach(task => {
                if (task.completed || !task.date || !task.time || !isToday(task.date)) return;

                const taskTime = parse(task.time, 'HH:mm', task.date);

                // 1. Check for proactive reminders
                if (task.reminderOffsetMinutes && !notifiedTasks.current.has(task.id)) {
                    const minsUntil = differenceInMinutes(taskTime, now);

                    if (minsUntil > 0 && minsUntil <= task.reminderOffsetMinutes) {
                        if (Notification.permission === 'granted') {
                            new Notification(`Reminder: ${task.title}`, {
                                body: `Starting in ${minsUntil} minutes.`,
                                icon: '/vite.svg' // Fallback icon
                            });
                        }
                        notifiedTasks.current.add(task.id);
                    }
                }

                // 2. Check for missed tasks (past due by > 30 mins) to auto-suggest
                if (isPast(taskTime) && differenceInMinutes(now, taskTime) > 30 && !rescheduledTasks.current.has(task.id)) {

                    // Only add suggestion if one doesn't already exist
                    const hasRescheduleSuggestion = task.suggestions.some(s => s.type === 'reschedule' && s.status === 'pending');

                    if (!hasRescheduleSuggestion) {
                        // We simulate a store dispatch here by directly updating the task via the store action pattern.
                        // Since we don't have a direct 'addSuggestion' action, we use a workaround by leveraging 
                        // the store's editTask function (which we added in the previous epic).
                        const newSuggestion: AiSuggestion = {
                            id: uuidv4(),
                            taskId: task.id,
                            type: 'reschedule',
                            message: 'This task seems past due. Want to reschedule it for tomorrow?',
                            data: '10:00', // Suggest 10 AM tomorrow
                            status: 'pending'
                        };

                        useStore.getState().editTask(task.id, {
                            suggestions: [...task.suggestions, newSuggestion]
                        });
                    }
                    rescheduledTasks.current.add(task.id);
                }
            });
        };

        const interval = setInterval(checkReminders, 60000); // Check every minute
        checkReminders(); // Initial check

        return () => clearInterval(interval);
    }, [tasks]);
};
