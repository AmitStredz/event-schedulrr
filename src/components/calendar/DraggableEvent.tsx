import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { Event } from '@/types/calendar';

interface DraggableEventProps {
  event: Event;
  onClick: (e: React.MouseEvent) => void;
  // onDelete: (e: React.MouseEvent) => void;
}

export function DraggableEvent({ event, onClick }: DraggableEventProps) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: event.id,
    data: event,
  });

  const style = transform ? {
    transform: CSS.Translate.toString(transform),
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={cn(
        'text-xs p-1 rounded truncate group cursor-move hover:bg-opacity-100',
        event.color === 'work' && 'bg-red-300 bg-opacity-80 text-blue-800',
        event.color === 'personal' && 'bg-green-300 bg-opacity-80 text-green-800',
        event.color === 'other' && 'bg-blue-300 bg-opacity-80 text-purple-800',
        event.color === 'default' && 'bg-gray-300 bg-opacity-80 text-gray-800'
      )}
    >
      <div className="flex justify-between items-center">
        <span className="truncate">{event.title}</span>
        {/* <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4 opacity-0 group-hover:opacity-100"
          onClick={onDelete}
        >
          ×
        </Button> */}
      </div>
      <div className="text-xs opacity-75">
        {event.startTime} - {event.endTime}
      </div>
    </div>
  );
}