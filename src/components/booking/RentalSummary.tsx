
import { useState } from "react";
import { format, differenceInDays } from "date-fns";
import { Calendar, Truck, Shield, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface RentalSummaryProps {
  itemName: string;
  dailyPrice: number;
  startDate?: Date;
  endDate?: Date;
  insuranceOption?: "basic" | "premium" | "none";
  onInsuranceChange?: (option: "basic" | "premium" | "none") => void;
}

export default function RentalSummary({
  itemName,
  dailyPrice,
  startDate,
  endDate,
  insuranceOption = "none",
  onInsuranceChange,
}: RentalSummaryProps) {
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  
  // Calculate rental duration
  const rentalDays = startDate && endDate
    ? differenceInDays(endDate, startDate) + 1
    : 0;
  
  // Calculate costs
  const rentalCost = dailyPrice * rentalDays;
  const insuranceCost = calculateInsuranceCost(insuranceOption, rentalCost);
  const deliveryFee = 15;
  const subtotal = rentalCost + insuranceCost + deliveryFee;
  const discount = promoApplied ? promoDiscount : 0;
  const total = subtotal - discount;
  
  function calculateInsuranceCost(option: string, baseCost: number): number {
    switch (option) {
      case "basic":
        return Math.round(baseCost * 0.05); // 5% of rental cost
      case "premium":
        return Math.round(baseCost * 0.12); // 12% of rental cost
      case "none":
      default:
        return 0;
    }
  }
  
  const handleInsuranceChange = (value: string) => {
    if (onInsuranceChange) {
      onInsuranceChange(value as "basic" | "premium" | "none");
    }
  };
  
  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === "FIRST20") {
      setPromoApplied(true);
      setPromoDiscount(Math.round(subtotal * 0.2)); // 20% discount
      toast.success("Promo code applied: 20% off!");
    } else {
      toast.error("Invalid promo code");
    }
    setPromoCode("");
  };
  
  const handleCheckout = () => {
    if (!startDate || !endDate) {
      toast.error("Please select rental dates");
      return;
    }
    
    toast.success("Redirecting to checkout...");
  };
  
  return (
    <Card className="bg-card w-full shadow-sm animate-fade-in">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Rental Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">{itemName}</h3>
          <div className="text-sm">${dailyPrice} per day</div>
        </div>
        
        {startDate && endDate ? (
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">
                  {format(startDate, "MMM d, yyyy")} - {format(endDate, "MMM d, yyyy")}
                </div>
                <div className="text-sm text-muted-foreground">
                  {rentalDays} {rentalDays === 1 ? "day" : "days"}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-muted/50 p-3 rounded-lg text-sm text-muted-foreground">
            No dates selected
          </div>
        )}
        
        <div className="space-y-3 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="insurance">Damage Protection</Label>
            <Select
              value={insuranceOption}
              onValueChange={handleInsuranceChange}
            >
              <SelectTrigger id="insurance">
                <SelectValue placeholder="Select protection plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No protection</SelectItem>
                <SelectItem value="basic">Basic Protection (5%)</SelectItem>
                <SelectItem value="premium">Premium Protection (12%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="insurance-details" className="border-0">
              <AccordionTrigger className="py-1 text-xs text-muted-foreground hover:no-underline">
                View protection details
              </AccordionTrigger>
              <AccordionContent className="text-xs space-y-2">
                <div className="space-y-1">
                  <div className="font-medium">Basic Protection</div>
                  <p>Covers accidental damage up to $200. You're responsible for any damage beyond this limit.</p>
                </div>
                <div className="space-y-1">
                  <div className="font-medium">Premium Protection</div>
                  <p>Covers all accidental damage and minor wear and tear. No worries if something happens!</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-dashed"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-card px-2 text-xs uppercase text-muted-foreground">
              Price Details
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Rental cost</span>
            <span>${rentalCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Protection plan</span>
            <span>${insuranceCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Delivery & pickup</span>
            <span>${deliveryFee.toFixed(2)}</span>
          </div>
          {promoApplied && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount (FIRST20)</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="pt-2">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className={cn(promoApplied && "text-green-600")}
                disabled={promoApplied}
              />
            </div>
            <Button
              variant="outline"
              onClick={applyPromoCode}
              disabled={!promoCode || promoApplied}
            >
              Apply
            </Button>
          </div>
          {promoApplied && (
            <div className="text-xs text-green-600 mt-1">
              Promo code FIRST20 applied: 20% off!
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button
          className="w-full"
          size="lg"
          onClick={handleCheckout}
          disabled={!startDate || !endDate}
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Proceed to checkout
        </Button>
        
        <div className="w-full flex flex-col gap-2 text-xs text-muted-foreground">
          <div className="flex items-start gap-2">
            <Truck className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>Free delivery and pickup in metropolitan areas</span>
          </div>
          <div className="flex items-start gap-2">
            <Shield className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>All items are professionally cleaned and sanitized between rentals</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
