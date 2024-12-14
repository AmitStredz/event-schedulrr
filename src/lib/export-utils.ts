import { Event } from '@/types/calendar';
import toast from 'react-hot-toast';
// import { toast } from 'sonner';

export function getEventsForMonth(events: Event[], year: number, month: number): Event[] {
  return events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.getFullYear() === year && eventDate.getMonth() === month;
  });
}

export function exportMonthEvents(events: Event[], year: number, month: number): void {
  const monthEvents = getEventsForMonth(events, year, month);
  console.log("monthEvents: ", monthEvents);
  
  if (monthEvents.length === 0) {
    console.error('No events found for the selected month');
    toast.error("No events found to export.", {
      duration: 4000,
    });
    return;
  }

  const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });
  const fileName = `calendar-events-${monthName}-${year}.json`;
  
  const dataStr = JSON.stringify(monthEvents, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', fileName);
  linkElement.click();
  
  console.log(`Events for ${monthName} ${year} exported successfully`);
}