export interface Task {
    id: string;
    title: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    color: string;
    priority: 'low' | 'medium' | 'high';
    completed: boolean;
    category?: string;
}

export interface TimeSlot {
    hour: number;
    minute: number;
    time: string;
}

export interface CalendarDay {
    date: Date;
    isToday: boolean;
    isCurrentMonth: boolean;
    tasks: Task[];
}

export interface DragTaskData {
    taskId: string;
    originalStartTime: Date;
    originalEndTime: Date;
} 