
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { addDays, differenceInDays, format, isBefore, isAfter, isSameDay } from "date-fns";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

interface RentalCalendarProps {
  onDateChange: (dates: { startDate: Date | undefined; endDate: Date | undefined }) => void;
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
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [nextMonth, setNextMonth] = useState<Date>(addDays(new Date(), 30));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Update the parent component whenever dates change
  useEffect(() => {
    onDateChange({ startDate, endDate });
  }, [startDate, endDate, onDateChange]);

  // Check if a date is unavailable
  const isDateUnavailable = (date: Date): boolean => {
    // Don't allow dates in the past
    if (isBefore(date, new Date()) && !isSameDay(date, new Date())) {
      return true;
    }

    // Check against unavailable date ranges
    return unavailableDates.some(
      (range) =>
        (isAfter(date, range.start) || isSameDay(date, range.start)) &&
        (isBefore(date, range.end) || isSameDay(date, range.end))
    );
  };

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    setErrorMessage(null);

    if (!date) {
      setStartDate(undefined);
      setEndDate(undefined);
      return;
    }

    // Check if date is unavailable
    if (isDateUnavailable(date)) {
      setErrorMessage("This date is unavailable for rental");
      return;
    }

    // First click - set start date
    if (!startDate) {
      setStartDate(date);
      setEndDate(undefined);
      return;
    }

    // Second click - set end date if valid
    if (!endDate) {
      // If clicking on or before start date, reset selection
      if (isBefore(date, startDate) || isSameDay(date, startDate)) {
        setStartDate(date);
        return;
      }

      // Check if any days in range are unavailable
      const daysInRange = differenceInDays(date, startDate);
      let rangeHasUnavailableDay = false;
      
      for (let i = 1; i < daysInRange; i++) {
        const dayToCheck = addDays(startDate, i);
        if (isDateUnavailable(dayToCheck)) {
          rangeHasUnavailableDay = true;
          break;
        }
      }
      
      if (rangeHasUnavailableDay) {
        setErrorMessage("Your selected range includes unavailable dates");
        return;
      }
      
      // Check if range is too short
      if (daysInRange < minRentalDays) {
        setErrorMessage(`Minimum rental period is ${minRentalDays} days`);
        return;
      }
      
      // Check if range is too long
      if (daysInRange > maxRentalDays) {
        setErrorMessage(`Maximum rental period is ${maxRentalDays} days`);
        return;
      }
      
      setEndDate(date);
    } else {
      // If already have both dates, start over
      setStartDate(date);
      setEndDate(undefined);
    }
  };

  const dayClassName = (date: Date) => {
    // Add classes based on selected state and availability
    const isSelected = 
      (startDate && isSameDay(date, startDate)) || 
      (endDate && isSameDay(date, endDate));
    
    const isWithinRange = 
      startDate && 
      !endDate && 
      isAfter(date, startDate) && 
      !isDateUnavailable(date);
      
    const isInSelectedRange = 
      startDate && 
      endDate && 
      isAfter(date, startDate) && 
      isBefore(date, endDate);
    
    const unavailable = isDateUnavailable(date);
    
    return {
      selectedDay: isSelected,
      withinRange: isWithinRange,
      inSelectedRange: isInSelectedRange,
      unavailableDay: unavailable
    };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Rental Dates</CardTitle>
        <CardDescription>
          Choose your rental period ({minRentalDays}-{maxRentalDays} days)
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="px-4 pb-4">
            <div className="text-sm font-medium mb-2">
              {format(currentMonth, "MMMM yyyy")}
            </div>
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={handleDateSelect}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              toMonth={addDays(new Date(), 90)}
              modifiers={{
                selectedDay: startDate ? [startDate] : [],
                withinRange: 
                  startDate && !endDate
                    ? Array.from({ length: 30 }).map((_, i) => addDays(startDate, i + 1))
                    : [],
                inSelectedRange:
                  startDate && endDate
                    ? Array.from({ length: differenceInDays(endDate, startDate) - 1 }).map((_, i) =>
                        addDays(startDate, i + 1)
                      )
                    : [],
                unavailableDay: Array.from({ length: 90 }).map((_, i) => {
                  const date = addDays(new Date(), i);
                  return isDateUnavailable(date) ? date : null;
                }).filter(Boolean) as Date[]
              }}
              modifiersClassNames={{
                selectedDay: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                withinRange: "bg-primary/10 text-primary hover:bg-primary/20",
                inSelectedRange: "bg-primary/10 text-primary hover:bg-primary/20",
                unavailableDay: "bg-muted text-muted-foreground opacity-50 cursor-not-allowed"
              }}
            />
          </div>
          <div className="px-4 pb-4">
            <div className="text-sm font-medium mb-2">
              {format(nextMonth, "MMMM yyyy")}
            </div>
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={handleDateSelect}
              month={nextMonth}
              onMonthChange={setNextMonth}
              fromMonth={addDays(new Date(), 30)}
              toMonth={addDays(new Date(), 180)}
              modifiers={{
                selectedDay: endDate ? [endDate] : [],
                withinRange: 
                  startDate && !endDate
                    ? Array.from({ length: 30 }).map((_, i) => addDays(startDate, i + 1))
                    : [],
                inSelectedRange:
                  startDate && endDate
                    ? Array.from({ length: differenceInDays(endDate, startDate) - 1 }).map((_, i) =>
                        addDays(startDate, i + 1)
                      )
                    : [],
                unavailableDay: Array.from({ length: 90 }).map((_, i) => {
                  const date = addDays(new Date(), i);
                  return isDateUnavailable(date) ? date : null;
                }).filter(Boolean) as Date[]
              }}
              modifiersClassNames={{
                selectedDay: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                withinRange: "bg-primary/10 text-primary hover:bg-primary/20",
                inSelectedRange: "bg-primary/10 text-primary hover:bg-primary/20",
                unavailableDay: "bg-muted text-muted-foreground opacity-50 cursor-not-allowed"
              }}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start">
        {errorMessage && (
          <Alert variant="destructive" className="mb-4">
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        
        <div className="text-sm text-muted-foreground">
          {startDate && !endDate && (
            <p>
              Start date selected: <span className="font-medium">{format(startDate, "MMMM d, yyyy")}</span>. 
              Now select your end date.
            </p>
          )}
          
          {startDate && endDate && (
            <div className="space-y-1">
              <p>
                Your rental: <span className="font-medium">{format(startDate, "MMMM d, yyyy")}</span> to{" "}
                <span className="font-medium">{format(endDate, "MMMM d, yyyy")}</span>
              </p>
              <p>
                Duration: <span className="font-medium">{differenceInDays(endDate, startDate)} days</span>
              </p>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
