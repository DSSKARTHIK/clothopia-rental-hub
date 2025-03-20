
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ClothingFilters from "@/components/clothing/ClothingFilters";
import ClothingGrid from "@/components/clothing/ClothingGrid";

export default function CategoryView() {
  const { category } = useParams<{ category: string }>();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading data
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [category]);
  
  // Format category name for display
  const formatCategoryName = (name?: string) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-2">{formatCategoryName(category)}</h1>
            <p className="text-muted-foreground">
              Browse our selection of {category?.toLowerCase()} for rent
            </p>
          </div>
          
          <ClothingFilters />
          
          <ClothingGrid category={category} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
