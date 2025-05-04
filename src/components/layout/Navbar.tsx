
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Search, User, Heart, LogIn, LogOut } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/contexts/WishlistContext";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { itemCount: wishlistCount } = useWishlist();
  const { user, profile, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    // Trigger initial check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        isScrolled
          ? "bg-background/70 backdrop-blur-xl shadow-sm py-4"
          : "bg-transparent py-6"
      )}
    >
      <div className="container px-4 mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4 md:gap-8">
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px] pt-16">
              <nav className="flex flex-col gap-4">
                <SheetClose asChild>
                  <Link
                    to="/"
                    className="flex items-center gap-2 py-2 hover:text-primary transition-colors"
                  >
                    Home
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    to="/browse"
                    className="flex items-center gap-2 py-2 hover:text-primary transition-colors"
                  >
                    Browse All
                  </Link>
                </SheetClose>
                <div className="py-2">
                  <p className="font-medium mb-2">Categories</p>
                  <div className="pl-2 flex flex-col gap-2">
                    <SheetClose asChild>
                      <Link
                        to="/categories/dresses"
                        className="text-muted-foreground hover:text-primary transition-colors py-1"
                      >
                        Dresses
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        to="/categories/suits"
                        className="text-muted-foreground hover:text-primary transition-colors py-1"
                      >
                        Suits
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        to="/categories/accessories"
                        className="text-muted-foreground hover:text-primary transition-colors py-1"
                      >
                        Accessories
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        to="/categories/outerwear"
                        className="text-muted-foreground hover:text-primary transition-colors py-1"
                      >
                        Outerwear
                      </Link>
                    </SheetClose>
                  </div>
                </div>
                <SheetClose asChild>
                  <Link
                    to="/wishlist"
                    className="flex items-center gap-2 py-2 hover:text-primary transition-colors"
                  >
                    Wishlist
                  </Link>
                </SheetClose>
                {user ? (
                  <>
                    <SheetClose asChild>
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2 py-2 hover:text-primary transition-colors"
                      >
                        My Account
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 py-2 hover:text-primary transition-colors text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </SheetClose>
                  </>
                ) : (
                  <SheetClose asChild>
                    <Link
                      to="/auth"
                      className="flex items-center gap-2 py-2 hover:text-primary transition-colors"
                    >
                      <LogIn className="h-4 w-4" />
                      Login / Register
                    </Link>
                  </SheetClose>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link to="/" className="text-xl font-bold tracking-tighter">
            Clothopia
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid grid-cols-2 gap-3 p-4 w-[400px]">
                    <Link
                      to="/categories/dresses"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">
                        Dresses
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Elegant dresses for any occasion
                      </p>
                    </Link>
                    <Link
                      to="/categories/suits"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">
                        Suits
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Premium suits for formal events
                      </p>
                    </Link>
                    <Link
                      to="/categories/accessories"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">
                        Accessories
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Complete your look with our accessories
                      </p>
                    </Link>
                    <Link
                      to="/categories/outerwear"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">
                        Outerwear
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Stylish jackets and coats
                      </p>
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/browse">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Browse All
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-2">
          {/* Search input (only visible on larger screens) */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex relative max-w-md"
          >
            <Input
              type="text"
              placeholder="Search..."
              className="w-[200px] lg:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>

          {/* Mobile search button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => navigate("/search")}
          >
            <Search className="h-5 w-5" />
          </Button>
          
          {/* Wishlist */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            onClick={() => navigate("/wishlist")}
          >
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center rounded-full text-[10px]"
              >
                {wishlistCount}
              </Badge>
            )}
          </Button>

          {/* Account */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <User className="h-5 w-5" />
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}` : 'My Account'}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/auth")}
            >
              <LogIn className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
