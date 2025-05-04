
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash,
  ChevronRight,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";

export default function CartDrawer() {
  const [open, setOpen] = useState(false);
  const { items, itemCount, removeItem, updateItemQuantity, getSubtotal, formatCurrency } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setOpen(false);
    navigate("/shipping-address");
  };

  const formatDate = (date?: Date) => {
    return date ? format(date, "MMM dd, yyyy") : "";
  };

  const calculateDays = (start?: Date, end?: Date) => {
    if (!start || !end) return 1;
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingBag className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center rounded-full text-[10px]">
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-xl">Shopping Cart</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-lg mb-1">Your cart is empty</h3>
            <p className="text-muted-foreground mb-4">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Button
              onClick={() => {
                setOpen(false);
                navigate("/browse");
              }}
            >
              Browse Collection
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto py-4">
              <div className="space-y-4">
                {items.map((item) => {
                  const days = calculateDays(item.rentalStart, item.rentalEnd);
                  const itemTotal = item.price * item.quantity * days;

                  return (
                    <div key={`${item.id}-${item.size}-${item.rentalStart?.getTime()}`} className="flex gap-4">
                      <div className="w-20 h-20 rounded-md overflow-hidden bg-muted">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium line-clamp-1">{item.name}</h4>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        {item.size && (
                          <div className="text-sm text-muted-foreground mb-1">
                            Size: {item.size}
                          </div>
                        )}

                        {item.rentalStart && item.rentalEnd && (
                          <div className="text-xs text-muted-foreground mb-2">
                            {formatDate(item.rentalStart)} - {formatDate(item.rentalEnd)} ({days} days)
                          </div>
                        )}

                        <div className="flex justify-between items-center">
                          <div className="flex items-center border rounded">
                            <button
                              onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <div className="font-medium">{formatCurrency(itemTotal)}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatCurrency(getSubtotal())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Insurance</span>
                  <span>{formatCurrency(0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery</span>
                  <span>{formatCurrency(0)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formatCurrency(getSubtotal())}</span>
                </div>
              </div>

              <SheetFooter>
                <Button className="w-full" onClick={handleCheckout}>
                  Checkout
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </SheetFooter>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
