import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { exportMonthEvents } from "@/lib/export-utils";
import { Event } from "@/types/calendar";

interface CalendarHeaderProps {
  currentDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  events: Event[];
}

export function CalendarHeader({
  currentDate,
  onPreviousMonth,
  onNextMonth,
  searchTerm,
  onSearchChange,
  events,
}: CalendarHeaderProps) {
  const handleExport = () => {
    console.log("export events: ", events);

    exportMonthEvents(
      events,
      currentDate.getFullYear(),
      currentDate.getMonth()
    );
  };

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <h2 className="text-2xl font-bold">
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={onPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={onNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Input
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-64"
        />
        <Button onClick={handleExport} className="flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Export Month</span>
        </Button>
      </div>
    </div>
  );
}
