
import { useState } from "react";
import ClothingCard from "./ClothingCard";

// Mock data for clothing items
const MOCK_CLOTHING = [
  {
    id: "1",
    name: "Floral Print ",
    price: 30,
    retailPrice: 320,
    image: "https://i5.walmartimages.com/asr/703151fb-f16e-4ce1-8fa3-95f29c981912_1.4f30402adade0b18584be88f0dd115b7.jpeg",
    brand: "Gucci",
    category: "Dresses",
    isNew: true,
  },
  {
    id: "2",
    name: "Classic Black Tuxedo",
    price: 89,
    retailPrice: 450,
    image: "https://www.mrporter.com/variants/images/1647597306907732/in/w2000_q60.jpg",
    brand: "Armani",
    category: "Suits",
  },
  {
    id: "3",
    name: "Silk Evening Gown",
    price: 75,
    retailPrice: 380,
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=2830&auto=format&fit=crop",
    brand: "Versace",
    category: "Dresses",
  },
  {
    id: "4",
    name: "Casual Linen Blazer",
    price: 45,
    retailPrice: 220,
    image: "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?q=80&w=2938&auto=format&fit=crop",
    brand: "Zara",
    category: "Outerwear",
    isNew: true,
  },
  {
    id: "5",
    name: "Sequin Cocktail Dress",
    price: 70,
    retailPrice: 350,
    image: "https://images.unsplash.com/photo-1596703263926-eb0762ee17e4?q=80&w=2787&auto=format&fit=crop",
    brand: "Prada",
    category: "Dresses",
  },
  {
    id: "6",
    name: "Navy Blue Suit",
    price: 85,
    retailPrice: 420,
    image: "https://th.bing.com/th/id/OIP.Co-EH9Jk6te-uBT9d0nEVQAAAA?rs=1&pid=ImgDetMain",
    brand: "Hugo Boss",
    category: "Suits",
  },
  {
    id: "7",
    name: "Crystal Embellished Clutch",
    price: 30,
    retailPrice: 150,
    image: "https://images.unsplash.com/photo-1601924638867-3a6de6b7a500?q=80&w=2770&auto=format&fit=crop",
    brand: "Chanel",
    category: "Accessories",
    isNew: true,
  },
  {
    id: "8",
    name: "Leather Biker Jacket",
    price: 55,
    retailPrice: 275,
    image: "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?q=80&w=2923&auto=format&fit=crop",
    brand: "Saint Laurent",
    category: "Outerwear",
  },
  {
    id: "9",
    name: "Velvet Formal Dress",
    price: 60,
    retailPrice: 300,
    image: "https://cdn.shopify.com/s/files/1/0014/6217/3742/products/11375574-WHIT_1_2000x.jpg?v=1582306758",
    brand: "Dolce & Gabbana",
    category: "Dresses",
  },
  {
    id: "10",
    name: "Charcoal Gray Suit",
    price: 80,
    retailPrice: 400,
    image: "https://images.unsplash.com/photo-1593032465175-481ac7f401a0?q=80&w=2940&auto=format&fit=crop",
    brand: "Tom Ford",
    category: "Suits",
    isNew: true,
  },
  {
    id: "11",
    name: "Off-Shoulder Satin Gown",
    price: 95,
    retailPrice: 475,
    image: "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?q=80&w=2874&auto=format&fit=crop",
    brand: "Valentino",
    category: "Dresses",
  },
  {
    id: "12",
    name: "Designer Bow Tie",
    price: 15,
    retailPrice: 75,
    image: "https://images.unsplash.com/photo-1607541602069-fef603da2be3?q=80&w=2781&auto=format&fit=crop",
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
