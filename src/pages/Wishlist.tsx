
import { useState, useEffect } from "react";
import { Heart, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOCK_CLOTHING } from "@/lib/productData";
import { useWishlist } from "@/contexts/WishlistContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ClothingCard from "@/components/clothing/ClothingCard";

export default function Wishlist() {
  const { items, removeItem, clearWishlist } = useWishlist();
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  
  useEffect(() => {
    // Get full item details from MOCK_CLOTHING
    const fullItems = items
      .map((item) => {
        const fullItem = MOCK_CLOTHING.find((product) => product.id === item.id);
        return fullItem ? { ...fullItem } : null;
      })
      .filter(Boolean) as any[];
    
    setWishlistItems(fullItems);
  }, [items]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
              <p className="text-muted-foreground">
                {wishlistItems.length} items saved for later
              </p>
            </div>
            
            {wishlistItems.length > 0 && (
              <Button 
                variant="outline" 
                onClick={clearWishlist}
                className="text-muted-foreground"
              >
                <Trash className="mr-2 h-4 w-4" />
                Clear All
              </Button>
            )}
          </div>
          
          {wishlistItems.length === 0 ? (
            <div className="text-center py-16 bg-muted/30 rounded-xl">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                <Heart className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-medium mb-2">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Items you save to your wishlist will appear here. Start exploring our collection to find items you love.
              </p>
              <Button asChild>
                <a href="/browse">Browse Collection</a>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlistItems.map((item) => (
                <ClothingCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  price={item.price}
                  retailPrice={item.retailPrice}
                  image={item.image}
                  brand={item.brand}
                  category={item.category}
                  isNew={item.isNew}
                  isFavorite={true}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
