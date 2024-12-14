import {
  formatDate,
  getCalendarDays,
  hasTimeConflict,
} from "@/lib/calendar-utils";
import React, { useEffect, useState } from "react";
import { CalendarHeader } from "./calendar/CalendarHeader";
import { Day, Event } from "@/types/calendar";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { DayEventsPanel } from "./calendar/DayEventsPanel";
import { EventDialog } from "./EventDialog";
import { SearchResults } from "./calendar/SearchResults";
import { DroppableDay } from "./calendar/DroppableDay";
// import { toast } from "sonner";
import { toast } from "react-toastify";

export default function CalendarDiv() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDay, setSelectedDay] = useState<Day | null>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isDayPanelOpen, setIsDayPanelOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [errorText, setErrorText] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>();
  const [events, setEvents] = useState<Event[]>(
    JSON.parse(localStorage.getItem("calendar-events") || "") || []
  );

  const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem("calendar-events", JSON.stringify(events));
      console.log("Events saved to localStorage: ", events);
    }
  }, [events]);

  const days = getCalendarDays(
    currentDate.getFullYear(),
    currentDate.getMonth()
  ).map((day) => ({
    ...day,
    events: events.filter((event) => event?.date === formatDate(day.date)),
  }));

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const handleDayClick = (day: Day) => {
    setSelectedDay(day);
    setIsDayPanelOpen(true);
  };

  const handleEventClick = (e: React.MouseEvent, event: Event) => {
    e.stopPropagation();
    setSelectedDate(new Date(event.date));
    setSelectedEvent(event);
    setIsEventDialogOpen(true);
  };

  const handleSaveEvent = (eventData: Omit<Event, "id">) => {
    const newEvent = {
      ...eventData,
      id: selectedEvent?.id || Math.random().toString(36).substr(2, 9),
    };

    // Check for time conflicts
    const dayEvents = events.filter(
      (e) => e.date === newEvent.date && e.id !== newEvent.id
    );

    const hasConflict = dayEvents.some((e) => hasTimeConflict(e, newEvent));

    console.log("testing...");

    if (hasConflict) {
      console.error("Time conflict with existing event!");
      setErrorText("Already have a meeting. Select another time frame.");
      toast("Failed.");
      return;
    }

    if (selectedEvent) {
      setEvents(events.map((e) => (e.id === selectedEvent.id ? newEvent : e)));
      console.log("Event updated successfully");
      setErrorText("");
      toast("Success.");
    } else {
      setEvents([...events, newEvent]);
      console.log("Event created successfully");
      setErrorText("");
      toast("Success.");
    }
    setIsEventDialogOpen(false);
    setIsDayPanelOpen(false);
  };

  const handleDeleteEvent = (e: React.MouseEvent, eventId: string) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this event?")) {
      setEvents(events.filter((event) => event.id !== eventId));
      console.log("Event deleted successfully");
      setIsDayPanelOpen(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const draggedEvent = active.data.current as Event;
    const targetDate = new Date(over.id as string);

    if (formatDate(targetDate) === draggedEvent.date) return;

    const updatedEvent = {
      ...draggedEvent,
      date: formatDate(targetDate),
    };

    // Check for conflicts on the target date
    const targetDayEvents = events.filter(
      (e) => e.date === updatedEvent.date && e.id !== updatedEvent.id
    );

    if (targetDayEvents.some((e) => hasTimeConflict(e, updatedEvent))) {
      console.error("Time conflict with existing event on target day");
      return;
    }

    setEvents(events.map((e) => (e.id === draggedEvent.id ? updatedEvent : e)));

    console.log("Event rescheduled successfully");
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="p-8 max-w-7xl mx-auto">
        <div className="space-y-4">
          <CalendarHeader
            currentDate={currentDate}
            onPreviousMonth={handlePreviousMonth}
            onNextMonth={handleNextMonth}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            events={events}
          />

          <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="bg-white p-4 text-center font-semibold text-sm"
              >
                {day}
              </div>
            ))}
            {days.map((day, index) => (
              <DroppableDay
                key={day.date.toISOString()}
                day={day}
                index={index}
                onDayClick={handleDayClick}
                onEventClick={handleEventClick}
                onEventDelete={handleDeleteEvent}
              />
            ))}
          </div>

          <SearchResults
            searchTerm={searchTerm}
            filteredEvents={filteredEvents}
            onEventSelect={(event) => {
              setSelectedDate(new Date(event.date));
              setSelectedEvent(event);
              setIsEventDialogOpen(true);
            }}
          />
        </div>

        {isEventDialogOpen && selectedDate && (
          <EventDialog
            isOpen={isEventDialogOpen}
            onClose={() => setIsEventDialogOpen(false)}
            onSave={handleSaveEvent}
            selectedDate={selectedDate}
            event={selectedEvent}
            errorText={errorText}
          />
        )}

        <DayEventsPanel
          selectedDay={selectedDay}
          open={isDayPanelOpen}
          onClose={() => setIsDayPanelOpen(false)}
          onAddEvent={() => {
            if (selectedDay) {
              setSelectedDate(selectedDay.date);
              setSelectedEvent(undefined);
              setIsEventDialogOpen(true);
            }
          }}
          onEditEvent={(event) => {
            setSelectedDate(new Date(event.date));
            console.log("clicked event: ", event);

            setSelectedEvent(event);
            setIsEventDialogOpen(true);
          }}
          onDeleteEvent={(event) =>
            handleDeleteEvent(
              { stopPropagation: () => {} } as React.MouseEvent,
              event.id
            )
          }
        />
      </div>
    </DndContext>
  );
}
