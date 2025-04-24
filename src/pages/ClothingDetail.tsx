
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Share2, Heart, ChevronDown, ChevronUp, ShoppingBag } from "lucide-react";
import { format, addDays } from "date-fns";
import { toast } from "sonner";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import RentalCalendar from "@/components/booking/RentalCalendar";
import RentalSummary from "@/components/booking/RentalSummary";
import { getProductById, getRelatedProducts } from "@/lib/productData";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import ClothingCard from "@/components/clothing/ClothingCard";

export default function ClothingDetail() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [rentalDates, setRentalDates] = useState<{
    startDate: Date | undefined;
    endDate: Date | undefined;
  }>({
    startDate: undefined,
    endDate: undefined,
  });
  const [insuranceOption, setInsuranceOption] = useState<"basic" | "premium" | "none">("basic");
  const [relatedItems, setRelatedItems] = useState<any[]>([]);
  const { addItem } = useCart();
  const { isInWishlist, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlist();
  const [isFavorite, setIsFavorite] = useState(false);
  
  useEffect(() => {
    setIsLoading(true);
    setCurrentImageIndex(0);
    setSelectedSize(null);
    
    const timer = setTimeout(() => {
      const product = getProductById(id || "");
      if (product) {
        const productWithImages = {
          ...product,
          images: product.image ? [product.image] : [],
          details: [
            `Brand: ${product.brand}`,
            `Category: ${product.category}`,
            "Premium quality material",
            "Dry clean recommended",
          ],
          sizing: "This item runs true to size. Select your normal size.",
          rentalInfo: {
            minDays: 3,
            maxDays: 14,
            unavailableDates: [
              { start: addDays(new Date(), 5), end: addDays(new Date(), 8) },
              { start: addDays(new Date(), 20), end: addDays(new Date(), 22) },
            ],
          },
          ratings: {
            average: 4.7,
            count: Math.floor(Math.random() * 30) + 5,
          },
          availableSizes: ["XS", "S", "M", "L"],
        };
        setItem(productWithImages);
        
        // Get related items
        if (product.category) {
          const related = getRelatedProducts(product.id, product.category);
          setRelatedItems(related);
        }
        
        // Check if item is in wishlist
        const inWishlist = isInWishlist(product.id);
        setIsFavorite(inWishlist);
      }
      setIsLoading(false);
    }, 600);
    
    return () => clearTimeout(timer);
  }, [id, isInWishlist]);
  
  const handleDateChange = (dates: { startDate: Date | undefined; endDate: Date | undefined }) => {
    setRentalDates(dates);
  };
  
  const handleInsuranceChange = (option: "basic" | "premium" | "none") => {
    setInsuranceOption(option);
  };
  
  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    toast.success(`Size ${size} selected`);
  };
  
  const toggleFavorite = () => {
    if (id) {
      if (isFavorite) {
        removeFromWishlist(id);
      } else {
        addToWishlist(id);
      }
      setIsFavorite(!isFavorite);
    }
  };
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };
  
  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    
    if (!rentalDates.startDate || !rentalDates.endDate) {
      toast.error("Please select rental dates");
      return;
    }
    
    // Add item to cart
    addItem({
      id: item.id,
      quantity: 1,
      name: item.name,
      price: item.price,
      image: item.image,
      size: selectedSize,
      rentalStart: rentalDates.startDate,
      rentalEnd: rentalDates.endDate,
      insuranceOption,
    });
  };
  
  if (isLoading || !item) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-24 px-4 md:px-6 flex items-center justify-center">
          <div className="animate-pulse w-full max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-[3/4] bg-muted rounded-xl"></div>
              <div className="space-y-6">
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-6 bg-muted rounded w-1/4"></div>
                <div className="h-32 bg-muted rounded w-full"></div>
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-10 bg-muted rounded"></div>
                  ))}
                </div>
                <div className="h-12 bg-muted rounded w-full"></div>
                <div className="h-64 bg-muted rounded w-full"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Calculate rental days and total cost
  const rentalDays = rentalDates.startDate && rentalDates.endDate
    ? Math.ceil((rentalDates.endDate.getTime() - rentalDates.startDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  
  const totalCost = item.price * rentalDays;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Product Images */}
            <div className="sticky top-24">
              <div className="relative">
                <Carousel className="w-full max-w-xl mx-auto">
                  <CarouselContent>
                    {item.images.map((image: string, index: number) => (
                      <CarouselItem key={index}>
                        <div className="aspect-[3/4] overflow-hidden rounded-xl bg-muted">
                          <img
                            src={image}
                            alt={`${item.name} - Image ${index + 1}`}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                </Carousel>
                
                {/* Image thumbnails */}
                <div className="flex justify-center mt-4 gap-2">
                  {item.images.map((image: string, index: number) => (
                    <button
                      key={index}
                      className={`w-16 h-20 overflow-hidden rounded-md ${
                        currentImageIndex === index ? "ring-2 ring-primary" : "opacity-70"
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="outline">{item.category}</Badge>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                      onClick={toggleFavorite}
                      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                      onClick={handleShare}
                      aria-label="Share"
                    >
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{item.name}</h1>
                <p className="text-muted-foreground mb-2">{item.brand}</p>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-xl font-semibold">${item.price}/day</span>
                  {item.retailPrice && (
                    <span className="text-muted-foreground line-through">
                      ${item.retailPrice} retail
                    </span>
                  )}
                </div>
                
                {/* Rating */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(item.ratings.average)
                            ? "text-yellow-400 fill-yellow-400"
                            : i < item.ratings.average
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300 fill-gray-300"
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm">
                    {item.ratings.average} ({item.ratings.count} reviews)
                  </span>
                </div>
                
                <p className="text-sm mb-6">{item.description}</p>
                
                {/* Size selection */}
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Select Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.availableSizes.map((size: string) => (
                      <Button
                        key={size}
                        variant={selectedSize === size ? "default" : "outline"}
                        className="min-w-12"
                        onClick={() => handleSizeSelect(size)}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {item.sizing}
                  </p>
                </div>
                
                {/* Tabs for additional information */}
                <Tabs defaultValue="rental">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="rental">Rental Dates</TabsTrigger>
                    <TabsTrigger value="details">Product Details</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="rental" className="pt-4">
                    <div className="space-y-6">
                      <RentalCalendar
                        onDateChange={handleDateChange}
                        minRentalDays={item.rentalInfo.minDays}
                        maxRentalDays={item.rentalInfo.maxDays}
                        unavailableDates={item.rentalInfo.unavailableDates}
                      />
                      
                      {rentalDates.startDate && (
                        <div className="space-y-6">
                          <RentalSummary
                            itemName={item.name}
                            dailyPrice={item.price}
                            startDate={rentalDates.startDate}
                            endDate={rentalDates.endDate}
                            insuranceOption={insuranceOption}
                            onInsuranceChange={handleInsuranceChange}
                          />
                          
                          <Button 
                            onClick={handleAddToCart} 
                            className="w-full"
                            disabled={!selectedSize || !rentalDates.startDate || !rentalDates.endDate}
                          >
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            Add to Cart
                          </Button>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="details" className="pt-4">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="details">
                        <AccordionTrigger>Product Details</AccordionTrigger>
                        <AccordionContent>
                          <ul className="list-disc pl-5 space-y-1 text-sm">
                            {item.details.map((detail: string, index: number) => (
                              <li key={index}>{detail}</li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="sizing">
                        <AccordionTrigger>Sizing & Fit</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-sm">{item.sizing}</p>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="shipping">
                        <AccordionTrigger>Shipping & Returns</AccordionTrigger>
                        <AccordionContent>
                          <div className="text-sm space-y-2">
                            <p>Free delivery and pickup in metropolitan areas.</p>
                            <p>We deliver your rental 1-2 days before your rental start date.</p>
                            <p>Simply schedule a pickup when you're done with your rental.</p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
          
          {/* Related Items Section */}
          {relatedItems.length > 0 && (
            <section className="mt-20">
              <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {relatedItems.map((item) => (
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
                    isFavorite={isInWishlist(item.id)}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
