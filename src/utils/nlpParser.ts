import { addDays, setHours, endOfDay, isToday } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { Subtask } from '../types';

export const parseTaskInput = (text: string) => {
    const lowerText = text.toLowerCase();

    // 1. Extract Date
    let parsedDate: Date | null = null;
    if (lowerText.includes('tomorrow')) {
        parsedDate = addDays(new Date(), 1);
    } else if (lowerText.includes('today') || lowerText.includes('tonight')) {
        parsedDate = new Date();
    }

    // 2. Extract Time
    let timeStr: string | null = null;
    const timeRegex = /(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i;
    const timeMatch = lowerText.match(timeRegex);

    if (timeMatch && parsedDate) {
        let hours = parseInt(timeMatch[1]);
        const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
        const period = timeMatch[3].toLowerCase();

        if (period === 'pm' && hours < 12) hours += 12;
        if (period === 'am' && hours === 12) hours = 0;

        parsedDate = setHours(parsedDate, hours);
        parsedDate.setMinutes(minutes);
        timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    // 3. Extract Duration
    let durationMinutes = 30; // default 30 mins
    const durationRegex = /(\d+)\s*(hour|hours|hr|hrs|min|mins|minutes)/i;
    const durationMatch = lowerText.match(durationRegex);
    if (durationMatch) {
        const val = parseInt(durationMatch[1]);
        const unit = durationMatch[2].toLowerCase();
        if (unit.startsWith('h')) {
            durationMinutes = val * 60;
        } else {
            durationMinutes = val;
        }
    }

    // 4. Calculate Priority Score & Category
    let priorityScore = 50;
    let category = 'Personal';

    if (lowerText.includes('urgent') || lowerText.includes('asap')) {
        priorityScore += 30;
    }

    if (lowerText.includes('meeting') || lowerText.includes('presentation') || lowerText.includes('client')) {
        category = 'Work';
        priorityScore += 20;
    } else if (lowerText.includes('gym') || lowerText.includes('workout') || lowerText.includes('yoga') || lowerText.includes('run')) {
        category = 'Fitness';
    } else if (lowerText.includes('buy') || lowerText.includes('groceries')) {
        category = 'Errands';
    }

    // 5. Clean Description (Strip out time/date keywords)
    let description = text
        .replace(/\b(tomorrow|today|tonight|urgent|asap)\b/gi, '')
        .replace(timeRegex, '')
        .replace(durationRegex, '')
        .replace(/\b(for|at)\b/gi, '')
        .replace(/\s{2,}/g, ' ')
        .trim();

    // 6. Generate AI Suggestions
    const suggestions: any[] = [];

    // Subtask Recommendations
    if (lowerText.includes('vacation') || lowerText.includes('trip')) {
        suggestions.push({
            type: 'subtasks',
            message: 'Want to break this down into travel steps?',
            data: [
                { id: uuidv4(), title: 'Book flights', completed: false },
                { id: uuidv4(), title: 'Reserve hotel', completed: false },
                { id: uuidv4(), title: 'Create itinerary', completed: false }
            ]
        });
    } else if (lowerText.includes('presentation') || lowerText.includes('report')) {
        suggestions.push({
            type: 'subtasks',
            message: 'Add standard report subtasks?',
            data: [
                { id: uuidv4(), title: 'Draft outline', completed: false },
                { id: uuidv4(), title: 'Gather data and metrics', completed: false },
                { id: uuidv4(), title: 'Design slides', completed: false }
            ]
        });
    }

    // Category Suggestion
    if (lowerText.includes('gym') && category !== 'Fitness') {
        suggestions.push({
            type: 'category',
            message: 'Categorize as Fitness?',
            data: 'Fitness'
        });
    }

    return {
        taskData: {
            title: text,
            description: description || 'New Task',
            date: parsedDate,
            time: timeStr,
            durationMinutes,
            category,
            priorityScore,
            subtasks: []
        },
        suggestions
    };
};
