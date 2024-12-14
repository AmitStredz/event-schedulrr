export interface Event {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  date: string;
  color?: 'default' | 'work' | 'personal' | 'other';
}

export interface Day {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: Event[];
}