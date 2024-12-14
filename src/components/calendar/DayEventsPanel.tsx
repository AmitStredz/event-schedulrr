import { Plus,  Edit2, Trash2 } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Event, Day } from '@/types/calendar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface DayEventsPanelProps {
  selectedDay: Day | null;
  onClose: () => void;
  onAddEvent: () => void;
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (event: Event) => void;
  open: boolean;
}

export function DayEventsPanel({
  selectedDay,
  onClose,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  open,
}: DayEventsPanelProps) {
  if (!selectedDay) return null;

  const sortedEvents = [...selectedDay.events].sort((a, b) => 
    a.startTime.localeCompare(b.startTime)
  );

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader className="space-y-4">
          <div className="flex items-center justify-between mt-5">
            <SheetTitle>
              Events for {selectedDay.date.toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </SheetTitle>
            {/* <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button> */}
          </div>
          <Button onClick={onAddEvent} className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Add New Event
          </Button>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-200px)] mt-6">
          <div className="space-y-4">
            {sortedEvents.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No events scheduled for this day
              </p>
            ) : (
              sortedEvents.map((event) => (
                <div
                  key={event.id}
                  className={cn(
                    'p-4 rounded-lg border',
                    event.color === 'work' && 'bg-red-200 border-blue-200',
                    event.color === 'personal' && 'bg-green-200 border-green-200',
                    event.color === 'other' && 'bg-blue-200 border-purple-200',
                    event.color === 'default' && 'bg-gray-200 border-gray-200'
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {event.startTime} - {event.endTime}
                      </div>
                      {event.description && (
                        <p className="text-sm mt-2">{event.description}</p>
                      )}
                      <Badge variant="outline" className="mt-2">
                        {event.color}
                      </Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEditEvent(event)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeleteEvent(event)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}