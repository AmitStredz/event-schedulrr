import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { Day } from '@/types/calendar';
import { DraggableEvent } from './DraggableEvent';

interface DroppableDayProps {
  day: Day;
  index: number;
  onDayClick: (day: Day) => void;
  onEventClick: (e: React.MouseEvent, event: any) => void;
  onEventDelete: (e: React.MouseEvent, eventId: string) => void;
}

export function DroppableDay({
  day,
  index,
  onDayClick,
  onEventClick,
  // onEventDelete,
}: DroppableDayProps) {
  const {isOver, setNodeRef} = useDroppable({
    id: day.date.toISOString(),
    data: day,
  });

  return (
    <div
      ref={setNodeRef}
      onClick={() => onDayClick(day)}
      className={cn(
        'bg-white p-4 min-h-[120px] cursor-pointer transition-colors hover:bg-slate-100',
        !day.isCurrentMonth && 'text-gray-400',
        day.isToday && 'ring-2 ring-blue-500',
        (index + 1) % 7 === 0 && 'bg-gray-50',
        isOver && 'bg-blue-50'
      )}
    >
      <div className="font-medium">{day.date.getDate()}</div>
      <div className="mt-2 space-y-1">
        {day.events.map(event => (
          <DraggableEvent
            key={event.id}
            event={event}
            onClick={(e) => onEventClick(e, event)}
            // onDelete={(e) => onEventDelete(e, event.id)}
          />
        ))}
      </div>
    </div>
  );
}