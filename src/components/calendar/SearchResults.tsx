import { Event } from "@/types/calendar";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";

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

  useEffect(() => {
    console.log("filteredEvents: ", filteredEvents);
  }, [filteredEvents]);

  return (
    <div className="bg-white w-[450px] p-5 px-10 border-2 rounded-lg z-50">
      <h3 className="text-lg font-semibold mb-2">Search Results</h3>
      <div className="space-y-2">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className={`p-4 z-50 rounded-lg shadow cursor-pointer hover:bg-opacity-100 transition-colors ${
              event.color === "work"
                ? "bg-red-300 bg-opacity-80 text-blue-800"
                : event.color === "personal"
                ? "bg-green-300 bg-opacity-80 text-green-800"
                : event.color === "other"
                ? "bg-blue-300 bg-opacity-80 text-purple-800"
                : event.color === "default"
                ? "bg-gray-300 bg-opacity-80 text-gray-800"
                : ""
            }`}
            onClick={() => onEventSelect(event)}
          >
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">{event.title}</h4>
                <p className="text-sm text-gray-500">
                  {new Date(event.date).toLocaleDateString()} •{" "}
                  {event.startTime} - {event.endTime}
                </p>
                {event.description && (
                  <p className="text-sm mt-1">{event.description}</p>
                )}
              </div>
              <Badge variant="outline" className="p-2 bg-black bg-opacity-10 rounded-md">{event.color}</Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
