
import { useState } from "react";
import ClothingCard from "./ClothingCard";
import { MOCK_CLOTHING } from "@/lib/productData";

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
