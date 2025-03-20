
import { useState } from "react";
import ClothingCard from "./ClothingCard";

// Mock data for clothing items
const MOCK_CLOTHING = [
  {
    id: "1",
    name: "Floral Print Maxi Dress",
    price: 65,
    retailPrice: 320,
    image: "https://i.imgur.com/VGfHxMJ.jpg",
    brand: "Gucci",
    category: "Dresses",
    isNew: true,
  },
  {
    id: "2",
    name: "Classic Black Tuxedo",
    price: 89,
    retailPrice: 450,
    image: "https://i.imgur.com/ZCnQGJD.jpg",
    brand: "Armani",
    category: "Suits",
  },
  {
    id: "3",
    name: "Silk Evening Gown",
    price: 75,
    retailPrice: 380,
    image: "https://i.imgur.com/U3qD5sM.jpg",
    brand: "Versace",
    category: "Dresses",
  },
  {
    id: "4",
    name: "Casual Linen Blazer",
    price: 45,
    retailPrice: 220,
    image: "https://i.imgur.com/JTOQ4L9.jpg",
    brand: "Zara",
    category: "Outerwear",
    isNew: true,
  },
  {
    id: "5",
    name: "Sequin Cocktail Dress",
    price: 70,
    retailPrice: 350,
    image: "https://i.imgur.com/YlDlpwW.jpg",
    brand: "Prada",
    category: "Dresses",
  },
  {
    id: "6",
    name: "Navy Blue Suit",
    price: 85,
    retailPrice: 420,
    image: "https://i.imgur.com/JWqT1Rc.jpg",
    brand: "Hugo Boss",
    category: "Suits",
  },
  {
    id: "7",
    name: "Crystal Embellished Clutch",
    price: 30,
    retailPrice: 150,
    image: "https://i.imgur.com/ogtYBlC.jpg",
    brand: "Chanel",
    category: "Accessories",
    isNew: true,
  },
  {
    id: "8",
    name: "Leather Biker Jacket",
    price: 55,
    retailPrice: 275,
    image: "https://i.imgur.com/B9rPyY3.jpg",
    brand: "Saint Laurent",
    category: "Outerwear",
  },
  {
    id: "9",
    name: "Velvet Formal Dress",
    price: 60,
    retailPrice: 300,
    image: "https://i.imgur.com/gJ2m5hZ.jpg",
    brand: "Dolce & Gabbana",
    category: "Dresses",
  },
  {
    id: "10",
    name: "Charcoal Gray Suit",
    price: 80,
    retailPrice: 400,
    image: "https://i.imgur.com/QgcXIen.jpg",
    brand: "Tom Ford",
    category: "Suits",
    isNew: true,
  },
  {
    id: "11",
    name: "Off-Shoulder Satin Gown",
    price: 95,
    retailPrice: 475,
    image: "https://i.imgur.com/PoXBm34.jpg",
    brand: "Valentino",
    category: "Dresses",
  },
  {
    id: "12",
    name: "Designer Bow Tie",
    price: 15,
    retailPrice: 75,
    image: "https://i.imgur.com/CBzvLZK.jpg",
    brand: "Fendi",
    category: "Accessories",
  },
];

interface ClothingGridProps {
  category?: string;
  filters?: any;
  searchQuery?: string;
}

export default function ClothingGrid({ 
  category,
  filters,
  searchQuery
}: ClothingGridProps) {
  const [loading, setLoading] = useState(false);

  // In a real app, we would filter the items based on the provided filters
  // For now, we'll just simulate a filter if category is provided
  let displayItems = MOCK_CLOTHING;
  
  if (category) {
    displayItems = MOCK_CLOTHING.filter(item => 
      item.category.toLowerCase() === category.toLowerCase()
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 8 }).map((_, index) => (
            <div 
              key={`skeleton-${index}`}
              className="rounded-xl overflow-hidden border bg-card animate-pulse"
            >
              <div className="aspect-[3/4] bg-muted"></div>
              <div className="p-4 space-y-3">
                <div className="h-2 bg-muted rounded-full w-1/3"></div>
                <div className="h-4 bg-muted rounded-full w-2/3"></div>
                <div className="h-3 bg-muted rounded-full w-1/2"></div>
                <div className="pt-2 flex gap-2">
                  <div className="h-8 bg-muted rounded w-full"></div>
                  <div className="h-8 bg-muted rounded w-full"></div>
                </div>
              </div>
            </div>
          ))
        ) : displayItems.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <h3 className="text-lg font-medium mb-2">No items found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search criteria.
            </p>
          </div>
        ) : (
          displayItems.map((item) => (
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
            />
          ))
        )}
      </div>
    </div>
  );
}
