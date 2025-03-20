
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ClothingFilters from "@/components/clothing/ClothingFilters";
import ClothingGrid from "@/components/clothing/ClothingGrid";

export default function Browse() {
  const [activeFilters, setActiveFilters] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleFilterChange = (filters: any) => {
    setIsLoading(true);
    setActiveFilters(filters);
    
    // Simulate applying filters
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Filters applied");
    }, 500);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-2">Browse Collection</h1>
            <p className="text-muted-foreground">
              Discover and rent premium clothing for any occasion
            </p>
          </div>
          
          <ClothingFilters onFilterChange={handleFilterChange} />
          
          <ClothingGrid />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
