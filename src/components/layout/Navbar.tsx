
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, User, Calendar, ShoppingBag, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  const isActive = (path: string) => location.pathname === path;

  // Navigation items
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Browse", path: "/browse" },
    { name: "Categories", path: "/categories" },
    { name: "How It Works", path: "/how-it-works" },
  ];

  // Icon nav items
  const iconNavItems = [
    { icon: Search, path: "/search", label: "Search" },
    { icon: Calendar, path: "/bookings", label: "My Bookings" },
    { icon: User, path: "/profile", label: "Profile" },
    { icon: ShoppingBag, path: "/cart", label: "Cart" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-apple px-4 md:px-6",
        scrolled
          ? "bg-background/80 backdrop-blur-lg border-b py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-bold flex items-center">
            <span className="text-primary tracking-tight">Clothopia</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "px-3 py-2 text-sm rounded-md transition-colors",
                  isActive(item.path)
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-primary hover:bg-accent"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Desktop action buttons */}
        <div className="hidden md:flex items-center space-x-1">
          {iconNavItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={cn(
                "p-2 rounded-full transition-colors",
                isActive(item.path)
                  ? "bg-accent text-primary"
                  : "text-muted-foreground hover:text-primary hover:bg-accent"
              )}
              aria-label={item.label}
            >
              <item.icon className="h-5 w-5" />
            </Link>
          ))}
          <Link to="/auth">
            <Button variant="default" size="sm" className="ml-2">
              Sign In
            </Button>
          </Link>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80%] sm:w-[350px] pr-0">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xl font-bold">Clothopia</span>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" aria-label="Close">
                      <X className="h-5 w-5" />
                    </Button>
                  </SheetClose>
                </div>
                
                <nav className="flex flex-col space-y-1 mb-6">
                  {navItems.map((item) => (
                    <SheetClose asChild key={item.name}>
                      <Link
                        to={item.path}
                        className={cn(
                          "px-4 py-3 rounded-md transition-colors text-base",
                          isActive(item.path)
                            ? "bg-accent text-primary font-medium"
                            : "text-muted-foreground hover:text-primary hover:bg-accent"
                        )}
                      >
                        {item.name}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
                
                <div className="border-t pt-6 mt-auto">
                  <div className="grid grid-cols-4 gap-2 mb-6">
                    {iconNavItems.map((item) => (
                      <SheetClose asChild key={item.label}>
                        <Link
                          to={item.path}
                          className="flex flex-col items-center justify-center p-2 rounded-md transition-colors hover:bg-accent"
                        >
                          <item.icon className="h-5 w-5 mb-1" />
                          <span className="text-xs">{item.label}</span>
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                  
                  <SheetClose asChild>
                    <Link to="/auth" className="block w-full">
                      <Button className="w-full" size="lg">
                        Sign In
                      </Button>
                    </Link>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
