import { Event } from '@/types/calendar';
import { Badge } from '@/components/ui/badge';

interface SearchResultsProps {
  searchTerm: string;
  filteredEvents: Event[];
  onEventSelect: (event: Event) => void;
}

export function SearchResults({
  searchTerm,
  filteredEvents,
  onEventSelect,
}: SearchResultsProps) {
  if (!searchTerm) return null;

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Search Results</h3>
      <div className="space-y-2">
        {filteredEvents.map(event => (
          <div
            key={event.id}
            className="p-4 bg-white rounded-lg shadow cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => onEventSelect(event)}
          >
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">{event.title}</h4>
                <p className="text-sm text-gray-500">
                  {new Date(event.date).toLocaleDateString()} • {event.startTime} - {event.endTime}
                </p>
                {event.description && (
                  <p className="text-sm mt-1">{event.description}</p>
                )}
              </div>
              <Badge variant="outline">{event.color}</Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}