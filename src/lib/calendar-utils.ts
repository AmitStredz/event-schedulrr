import { Day, Event } from "@/types/calendar";

export function getDaysInMonth(year: number, month: number): Date[] {
  const date = new Date(year, month, 1);
  const days: Date[] = [];

  // Get the first day of the month
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return days;
}

export function getCalendarDays(year: number, month: number): Day[] {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const days: Day[] = [];

  // Add days from previous month
  const firstDayOfWeek = firstDayOfMonth.getDay();
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month, -i);
    days.push({
      date,
      isCurrentMonth: false,
      isToday: isSameDay(date, new Date()),
      events: [],
    });
  }

  // Add days of current month
  const daysInMonth = getDaysInMonth(year, month);
  daysInMonth.forEach((date) => {
    days.push({
      date,
      isCurrentMonth: true,
      isToday: isSameDay(date, new Date()),
      events: [],
    });
  });

  // Add days from next month
  const lastDayOfWeek = lastDayOfMonth.getDay();
  for (let i = 1; i <= 6 - lastDayOfWeek; i++) {
    const date = new Date(year, month + 1, i);
    days.push({
      date,
      isCurrentMonth: false,
      isToday: isSameDay(date, new Date()),
      events: [],
    });
  }

  return days;
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

export function formatDate(dateString: Date): string {
  // return date.toISOString().split('T')[0];
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function hasTimeConflict(event1: Event, event2: Event): boolean {
  const start1 = new Date(`${event1.date}T${event1.startTime}`);
  const end1 = new Date(`${event1.date}T${event1.endTime}`);
  const start2 = new Date(`${event2.date}T${event2.startTime}`);
  const end2 = new Date(`${event2.date}T${event2.endTime}`);

  return start1 < end2 && end1 > start2;
}
