
import { useState } from "react";
import { format, addDays, isBefore, isAfter, isSameDay, isWithinInterval } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

interface RentalCalendarProps {
  onDateChange?: (dates: { startDate: Date | undefined; endDate: Date | undefined }) => void;
  minRentalDays?: number;
  maxRentalDays?: number;
  unavailableDates?: Array<{ start: Date; end: Date }>;
}

export default function RentalCalendar({
  onDateChange,
  minRentalDays = 3,
  maxRentalDays = 14,
  unavailableDates = [],
}: RentalCalendarProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isSelectingEnd, setIsSelectingEnd] = useState(false);
  
  const today = new Date();
  
  const handleSelect = (date: Date | undefined) => {
    if (!date) return;
    
    // If no start date is selected or if we're starting a new selection
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(undefined);
      setIsSelectingEnd(true);
      
      if (onDateChange) {
        onDateChange({ startDate: date, endDate: undefined });
      }
      return;
    }
    
    // If start date is selected and we're selecting end date
    if (startDate && !endDate && isSelectingEnd) {
      // Ensure end date is after start date
      if (isBefore(date, startDate)) {
        setStartDate(date);
        
        if (onDateChange) {
          onDateChange({ startDate: date, endDate: undefined });
        }
        return;
      }
      
      // Check if the selected range overlaps with unavailable dates
      const isOverlapping = unavailableDates.some(unavailable => 
        isWithinInterval(unavailable.start, { start: startDate, end: date }) ||
        isWithinInterval(unavailable.end, { start: startDate, end: date })
      );
      
      if (isOverlapping) {
        // Handle overlapping
        return;
      }
      
      // Calculate days between
      const daysBetween = Math.floor((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      
      // Check min/max rental days
      if (daysBetween < minRentalDays || daysBetween > maxRentalDays) {
        // Handle invalid rental period
        return;
      }
      
      setEndDate(date);
      setIsSelectingEnd(false);
      
      if (onDateChange) {
        onDateChange({ startDate, endDate: date });
      }
    }
  };
  
  const isDateUnavailable = (date: Date) => {
    if (isBefore(date, today) && !isSameDay(date, today)) {
      return true;
    }
    
    return unavailableDates.some(unavailable => 
      isWithinInterval(date, { start: unavailable.start, end: unavailable.end })
    );
  };
  
  const dayClassName = (date: Date) => {
    if (startDate && endDate && isWithinInterval(date, { start: startDate, end: endDate })) {
      if (isSameDay(date, startDate)) return "bg-primary text-primary-foreground rounded-l-md";
      if (isSameDay(date, endDate)) return "bg-primary text-primary-foreground rounded-r-md";
      return "bg-primary/10 text-primary";
    }
    
    if (startDate && isSameDay(date, startDate)) {
      return "bg-primary text-primary-foreground";
    }
    
    return undefined;
  };
  
  const resetDates = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setIsSelectingEnd(false);
    
    if (onDateChange) {
      onDateChange({ startDate: undefined, endDate: undefined });
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start-date">Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="start-date"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={handleSelect}
                disabled={isDateUnavailable}
                modifiers={{
                  selected: startDate ? [startDate] : [],
                  range: startDate && endDate ? [startDate, endDate] : [],
                }}
                modifiersClassNames={{
                  selected: "bg-primary text-primary-foreground",
                  range: "bg-primary/10 text-primary",
                }}
                className="p-3 pointer-events-auto"
                components={{
                  Day: ({ date, ...props }) => (
                    <button
                      {...props}
                      className={cn(props.className, dayClassName(date))}
                    />
                  ),
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="end-date">End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="end-date"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left",
                  !endDate && "text-muted-foreground"
                )}
                disabled={!startDate}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={handleSelect}
                disabled={(date) => {
                  if (!startDate) return true;
                  
                  // Prevent selecting dates before start date
                  if (isBefore(date, startDate)) return true;
                  
                  // Prevent selecting dates beyond max rental period
                  if (isAfter(date, addDays(startDate, maxRentalDays - 1))) return true;
                  
                  return isDateUnavailable(date);
                }}
                modifiers={{
                  selected: endDate ? [endDate] : [],
                  range: startDate && endDate ? [startDate, endDate] : [],
                }}
                modifiersClassNames={{
                  selected: "bg-primary text-primary-foreground",
                  range: "bg-primary/10 text-primary",
                }}
                className="p-3 pointer-events-auto"
                components={{
                  Day: ({ date, ...props }) => (
                    <button
                      {...props}
                      className={cn(props.className, dayClassName(date))}
                    />
                  ),
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      {startDate && (
        <div className="flex justify-between items-center pt-2">
          <Button variant="ghost" size="sm" onClick={resetDates}>
            Reset dates
          </Button>
          <div className="text-sm text-muted-foreground">
            {minRentalDays === maxRentalDays
              ? `Rental period: ${minRentalDays} days`
              : `Rental period: ${minRentalDays}-${maxRentalDays} days`}
          </div>
        </div>
      )}
    </div>
  );
}
