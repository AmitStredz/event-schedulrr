import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Event } from "@/types/calendar";

interface EventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<Event, "id">) => void;
  selectedDate: Date;
  event?: Event;
  errorText: String;
}

export function EventDialog({
  isOpen,
  onClose,
  onSave,
  selectedDate,
  event,
  errorText,
}: EventDialogProps) {
  const [title, setTitle] = useState(event?.title || "");
  const [description, setDescription] = useState(event?.description || "");
  const [startTime, setStartTime] = useState(event?.startTime || "09:00");
  const [endTime, setEndTime] = useState(event?.endTime || "10:00");
  const [color, setColor] = useState<Event["color"]>(event?.color || "default");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      description,
      startTime,
      endTime,
      date: selectedDate.toISOString().split("T")[0],
      color,
    });
    // onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{event ? "Edit Event" : "Add Event"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Event title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>
          <Select
            value={color}
            onValueChange={(value: Event["color"]) => setColor(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select color" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="work">Work</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button type="submit">{event ? "Update" : "Add"} Event</Button>
          </DialogFooter>
          <div className="flex justify-end">
            {errorText && (
              <span className="text-red-500 text-[14px]">{errorText}</span>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
