
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Search, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Animation state
  const [animationsTriggered, setAnimationsTriggered] = useState({
    hero: false,
    search: false,
    categories: false,
    featured: false
  });
  
  // Refs for scroll detection
  const heroRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.success(`Searching for "${searchQuery}"`);
    }
  };

  useEffect(() => {
    // Trigger initial animations with a slight delay
    setTimeout(() => {
      setAnimationsTriggered(prev => ({
        ...prev,
        hero: true
      }));
    }, 200);
    
    setTimeout(() => {
      setAnimationsTriggered(prev => ({
        ...prev,
        search: true
      }));
    }, 400);
    
    setTimeout(() => {
      setAnimationsTriggered(prev => ({
        ...prev,
        categories: true
      }));
    }, 600);

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
      
      // Check if featured section is in view
      if (featuredRef.current) {
        const rect = featuredRef.current.getBoundingClientRect();
        if (rect.top <= window.innerHeight - 100) {
          setAnimationsTriggered(prev => ({
            ...prev,
            featured: true
          }));
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Trigger initial check
    handleScroll();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Featured categories
  const categories = [
    { name: "Dresses", image: "https://i.imgur.com/VGfHxMJ.jpg" },
    { name: "Suits", image: "https://i.imgur.com/ZCnQGJD.jpg" },
    { name: "Accessories", image: "https://i.imgur.com/ogtYBlC.jpg" },
    { name: "Outerwear", image: "https://i.imgur.com/JTOQ4L9.jpg" },
  ];

  // Benefits
  const benefits = [
    {
      title: "Save Money",
      description: "Rent designer clothing for a fraction of the retail price.",
    },
    {
      title: "Free Delivery",
      description: "We offer free delivery and pickup within metropolitan areas.",
    },
    {
      title: "Professionally Cleaned",
      description: "All items are professionally cleaned and sanitized after each rental.",
    },
    {
      title: "Easy Returns",
      description: "Simply schedule a pickup when you're done with your rental.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 lg:pt-32 pb-16 lg:pb-24 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div 
            ref={heroRef}
            className={`max-w-3xl mx-auto text-center transition-all duration-700 ${
              animationsTriggered.hero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <Badge variant="outline" className="mb-4 px-3 py-1">
              Style without commitment
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Rent Premium Clothing for Any Occasion
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Access designer clothing for a fraction of the cost. Rent, wear, return – it's that simple.
            </p>
            <div
              ref={searchRef}
              className={`max-w-md mx-auto mb-12 transition-all duration-700 delay-200 ${
                animationsTriggered.search ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <form 
                onSubmit={handleSearch}
                className="relative"
              >
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for dresses, suits, accessories..."
                  className="pl-10 pr-20 h-12 rounded-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button 
                  type="submit"
                  className="absolute right-1 top-1 rounded-full h-10"
                  disabled={!searchQuery.trim()}
                >
                  Search
                </Button>
              </form>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link to="/browse">
                  Browse Collection
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/how-it-works">
                  How It Works
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Background gradient */}
        <div className="absolute top-0 left-0 right-0 h-3/4 bg-gradient-to-b from-accent/50 to-transparent -z-10" />
      </section>
      
      {/* Categories Section */}
      <section 
        ref={categoriesRef}
        className={`py-16 px-4 transition-all duration-700 delay-300 ${
          animationsTriggered.categories ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Browse by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover the perfect outfit for any occasion from our curated collection
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link to={`/categories/${category.name.toLowerCase()}`} key={index}>
                <div className="relative overflow-hidden rounded-xl group card-hover">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 transition-opacity">
                    <h3 className="text-white text-xl font-bold">{category.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Button asChild variant="outline">
              <Link to="/categories">
                View All Categories <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Featured Items Section */}
      <section
        ref={featuredRef}
        className={`py-16 px-4 bg-muted/30 transition-all duration-700 ${
          animationsTriggered.featured ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-3">
              Just Added
            </Badge>
            <h2 className="text-3xl font-bold mb-3">Featured Items</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our newest arrivals and most coveted pieces
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Featured items would be displayed here */}
            {/* For brevity, we're not implementing this fully */}
          </div>
          
          <div className="text-center mt-10">
            <Button asChild>
              <Link to="/browse">
                View All Items <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Why Rent With Us</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience premium fashion without the premium price tag
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex flex-col items-center text-center p-6 rounded-xl bg-accent/50">
                <CheckCircle className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-medium mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Elevate Your Wardrobe?</h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Join thousands of fashion enthusiasts who rent instead of buy. Your perfect outfit is just a few clicks away.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" variant="secondary">
              <Link to="/browse">
                Browse Collection
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/auth">
                Create Account
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
