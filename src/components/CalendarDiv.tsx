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
import toast from "react-hot-toast";

export default function CalendarDiv() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDay, setSelectedDay] = useState<Day | null>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isDayPanelOpen, setIsDayPanelOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [errorText, setErrorText] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>();
  const [events, setEvents] = useState<Event[]>(() => {
    const storedEvents = localStorage.getItem("calendar-events");
    try {
      return storedEvents ? JSON.parse(storedEvents) : [];
    } catch (error) {
      console.error("Error parsing localStorage data:", error);
      return [];
    }
  });
  const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // useEffect(() => {
  //   console.log("filteredEvents: ", filteredEvents);
  // }, [filteredEvents]);

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

  // const formatDate2 = (dateString: Date): string => {
  //   const date = new Date(dateString);
  //   const year = date.getFullYear();
  //   const month = String(date.getMonth() + 1).padStart(2, "0");
  //   const day = String(date.getDate()).padStart(2, "0");

  //   return `${year}-${month}-${day}`;
  // };

  const handleSaveEvent = (eventData: Omit<Event, "id">) => {
    if (!selectedDate) {
      console.log("No date selected.");
      return;
    }
    const newEvent = {
      ...eventData,
      id: selectedEvent?.id || Math.random().toString(36).substr(2, 9),
      date: formatDate(selectedDate), // Store as YYYY-MM-DD
    };
    console.log("Selected date1: ", selectedDate);

    console.log("new date1 ", newEvent.date);
    console.log("eventData date ", eventData.date);

    // Check for time conflicts
    const dayEvents = events.filter(
      (e) => e.date === newEvent.date && e.id !== newEvent.id
    );

    const hasConflict = dayEvents.some((e) => hasTimeConflict(e, newEvent));
    console.log("new date2", newEvent.date);

    console.log("testing...");

    if (hasConflict) {
      console.error("Time conflict with existing event!");
      setErrorText("Already have a meeting. Select another time frame.");
      toast.error("Time conflict. Try again", {
        duration: 4000,
      });
      return;
    }

    if (selectedEvent) {
      setEvents(events.map((e) => (e.id === selectedEvent.id ? newEvent : e)));
      console.log("Event updated successfully");
      setErrorText("");
      toast.success("Event updated Successfully.", {
        duration: 4000,
      });
      setSelectedEvent(undefined);
    } else {
      setEvents([...events, newEvent]);
      console.log("Event created successfully");
      setErrorText("");
      toast.success("Event added  Successfully.", {
        duration: 4000,
      });
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
      toast.success("Event deleted  Successfully.", {
        duration: 4000,
      });
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
      toast.error("Time conflict.", {
        duration: 4000,
      });
      return;
    }

    setEvents(events.map((e) => (e.id === draggedEvent.id ? updatedEvent : e)));

    toast.success("Event rescheduled  Successfully.", {
      duration: 4000,
    });
    console.log("Event rescheduled successfully");
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="p-3 max-w-7xl mx-auto">
        <div className="space-y-4">
          <div className="relative w-full h-full">
            <CalendarHeader
              currentDate={currentDate}
              onPreviousMonth={handlePreviousMonth}
              onNextMonth={handleNextMonth}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              events={events}
            />

            <div className="absolute right-0 top-10">
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
          </div>

          <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="bg-white p-3 text-center font-semibold text-sm"
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
              setSelectedDate(selectedDay?.date || new Date());
              console.log("Selected date1: ", selectedDate);

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
