
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { toast } from "sonner";
import { MOCK_CLOTHING } from "@/lib/productData";

interface WishlistItem {
  id: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  itemCount: number;
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  // Initialize from localStorage if available
  const [items, setItems] = useState<WishlistItem[]>(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage when items change
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(items));
  }, [items]);

  const addItem = (id: string) => {
    setItems((prevItems) => {
      // Check if item already exists
      if (prevItems.some((item) => item.id === id)) {
        toast.info("Item already in wishlist");
        return prevItems;
      } else {
        // Get item details from MOCK_CLOTHING
        const item = MOCK_CLOTHING.find((item) => item.id === id);
        if (item) {
          toast.success(`Added ${item.name} to wishlist`);
        }
        return [...prevItems, { id }];
      }
    });
  };

  const removeItem = (id: string) => {
    setItems((prevItems) => {
      const item = MOCK_CLOTHING.find((item) => item.id === id);
      if (item) {
        toast.success(`Removed ${item.name} from wishlist`);
      }
      return prevItems.filter((item) => item.id !== id);
    });
  };

  const isInWishlist = (id: string) => {
    return items.some((item) => item.id === id);
  };

  const clearWishlist = () => {
    setItems([]);
    toast.success("Wishlist cleared");
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        itemCount: items.length,
        addItem,
        removeItem,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
