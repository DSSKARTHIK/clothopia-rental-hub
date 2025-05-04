
import { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "sonner";
import { MOCK_CLOTHING } from "@/lib/productData";

// Product with rental dates
export interface CartItem {
  id: string;
  quantity: number;
  name: string;
  price: number;
  image: string;
  rentalStart?: Date;
  rentalEnd?: Date;
  size?: string;
  insuranceOption?: "basic" | "premium" | "none";
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  formatCurrency: (amount: number) => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: CartItem) => {
    setItems((prevItems) => {
      // Check if item already exists
      const existingItemIndex = prevItems.findIndex((i) => 
        i.id === item.id && 
        i.size === item.size && 
        i.rentalStart?.getTime() === item.rentalStart?.getTime() &&
        i.rentalEnd?.getTime() === item.rentalEnd?.getTime()
      );

      if (existingItemIndex !== -1) {
        // Update quantity if item exists
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += item.quantity;
        toast.success(`Updated quantity for ${item.name}`);
        return newItems;
      } else {
        // Add new item
        toast.success(`Added ${item.name} to cart`);
        return [...prevItems, item];
      }
    });
  };

  const removeItem = (id: string) => {
    setItems((prevItems) => {
      const removedItem = prevItems.find((item) => item.id === id);
      if (removedItem) {
        toast.success(`Removed ${removedItem.name} from cart`);
      }
      return prevItems.filter((item) => item.id !== id);
    });
  };

  const updateItemQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    toast.success("Cart cleared");
  };

  const getSubtotal = () => {
    return items.reduce((total, item) => {
      const itemTotal = item.price * item.quantity;
      // If rental dates are present, calculate based on days
      if (item.rentalStart && item.rentalEnd) {
        const days = Math.ceil(
          (item.rentalEnd.getTime() - item.rentalStart.getTime()) / (1000 * 60 * 60 * 24)
        );
        return total + itemTotal * days;
      }
      return total + itemTotal;
    }, 0);
  };

  // Format currency in Indian Rupees
  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        addItem,
        removeItem,
        updateItemQuantity,
        clearCart,
        getSubtotal,
        formatCurrency,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
