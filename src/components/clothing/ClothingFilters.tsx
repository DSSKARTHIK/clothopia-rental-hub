
import { useState } from "react";
import { Check, ChevronDown, X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const categories = [
  "Dresses",
  "Suits",
  "Tops",
  "Bottoms",
  "Outerwear",
  "Accessories",
];

const occasions = [
  "Wedding",
  "Formal",
  "Party",
  "Casual",
  "Business",
  "Vacation",
];

const colors = [
  { name: "Black", value: "#000000" },
  { name: "White", value: "#FFFFFF" },
  { name: "Red", value: "#FF0000" },
  { name: "Blue", value: "#0000FF" },
  { name: "Green", value: "#00FF00" },
  { name: "Yellow", value: "#FFFF00" },
  { name: "Purple", value: "#800080" },
  { name: "Pink", value: "#FFC0CB" },
  { name: "Brown", value: "#964B00" },
  { name: "Gray", value: "#808080" },
];

const sizes = ["XXS", "XS", "S", "M", "L", "XL", "XXL"];

const brands = [
  "Gucci",
  "Prada",
  "Versace",
  "Chanel",
  "Dior",
  "Armani",
  "Fendi",
  "Balenciaga",
  "Louis Vuitton",
  "Saint Laurent",
];

interface FiltersState {
  categories: string[];
  occasions: string[];
  colors: string[];
  sizes: string[];
  brands: string[];
  priceRange: [number, number];
}

interface ClothingFiltersProps {
  onFilterChange?: (filters: FiltersState) => void;
}

export default function ClothingFilters({ onFilterChange }: ClothingFiltersProps) {
  const [activeFilters, setActiveFilters] = useState<FiltersState>({
    categories: [],
    occasions: [],
    colors: [],
    sizes: [],
    brands: [],
    priceRange: [0, 500],
  });
  
  const [sortOption, setSortOption] = useState("recommended");
  
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  // Count total active filters
  const activeFilterCount = 
    activeFilters.categories.length +
    activeFilters.occasions.length +
    activeFilters.colors.length +
    activeFilters.sizes.length +
    activeFilters.brands.length +
    (activeFilters.priceRange[0] > 0 || activeFilters.priceRange[1] < 500 ? 1 : 0);
  
  const handleToggleCategory = (category: string) => {
    setActiveFilters((prev) => {
      const updated = { ...prev };
      if (prev.categories.includes(category)) {
        updated.categories = prev.categories.filter((c) => c !== category);
      } else {
        updated.categories = [...prev.categories, category];
      }
      return updated;
    });
  };

  const handleToggleOccasion = (occasion: string) => {
    setActiveFilters((prev) => {
      const updated = { ...prev };
      if (prev.occasions.includes(occasion)) {
        updated.occasions = prev.occasions.filter((o) => o !== occasion);
      } else {
        updated.occasions = [...prev.occasions, occasion];
      }
      return updated;
    });
  };

  const handleToggleColor = (color: string) => {
    setActiveFilters((prev) => {
      const updated = { ...prev };
      if (prev.colors.includes(color)) {
        updated.colors = prev.colors.filter((c) => c !== color);
      } else {
        updated.colors = [...prev.colors, color];
      }
      return updated;
    });
  };

  const handleToggleSize = (size: string) => {
    setActiveFilters((prev) => {
      const updated = { ...prev };
      if (prev.sizes.includes(size)) {
        updated.sizes = prev.sizes.filter((s) => s !== size);
      } else {
        updated.sizes = [...prev.sizes, size];
      }
      return updated;
    });
  };

  const handleToggleBrand = (brand: string) => {
    setActiveFilters((prev) => {
      const updated = { ...prev };
      if (prev.brands.includes(brand)) {
        updated.brands = prev.brands.filter((b) => b !== brand);
      } else {
        updated.brands = [...prev.brands, brand];
      }
      return updated;
    });
  };

  const handlePriceChange = (value: number[]) => {
    setActiveFilters((prev) => ({
      ...prev,
      priceRange: [value[0], value[1]] as [number, number],
    }));
  };

  const handleClearFilters = () => {
    setActiveFilters({
      categories: [],
      occasions: [],
      colors: [],
      sizes: [],
      brands: [],
      priceRange: [0, 500],
    });
  };

  const handleApplyFilters = () => {
    if (onFilterChange) {
      onFilterChange(activeFilters);
    }
    setMobileFiltersOpen(false);
  };

  // Remove individual filter
  const handleRemoveFilter = (type: keyof FiltersState, value: string) => {
    setActiveFilters((prev) => {
      const updated = { ...prev };
      if (Array.isArray(updated[type])) {
        (updated[type] as string[]) = (updated[type] as string[]).filter(
          (item) => item !== value
        );
      }
      return updated;
    });
  };

  // Reset price range
  const handleResetPriceRange = () => {
    setActiveFilters((prev) => ({
      ...prev,
      priceRange: [0, 500],
    }));
  };

  const FilterContent = () => (
    <>
      <Accordion type="multiple" className="w-full">
        <AccordionItem value="category">
          <AccordionTrigger className="text-sm py-3">Category</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={activeFilters.categories.includes(category)}
                    onCheckedChange={() => handleToggleCategory(category)}
                  />
                  <Label
                    htmlFor={`category-${category}`}
                    className="text-sm cursor-pointer flex-1"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="occasion">
          <AccordionTrigger className="text-sm py-3">Occasion</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {occasions.map((occasion) => (
                <div key={occasion} className="flex items-center space-x-2">
                  <Checkbox
                    id={`occasion-${occasion}`}
                    checked={activeFilters.occasions.includes(occasion)}
                    onCheckedChange={() => handleToggleOccasion(occasion)}
                  />
                  <Label
                    htmlFor={`occasion-${occasion}`}
                    className="text-sm cursor-pointer flex-1"
                  >
                    {occasion}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="size">
          <AccordionTrigger className="text-sm py-3">Size</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <Button
                  key={size}
                  variant={activeFilters.sizes.includes(size) ? "default" : "outline"}
                  size="sm"
                  className="h-8 px-3 rounded-full"
                  onClick={() => handleToggleSize(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="color">
          <AccordionTrigger className="text-sm py-3">Color</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-3">
              {colors.map((color) => (
                <button
                  key={color.name}
                  className={cn(
                    "w-8 h-8 rounded-full relative overflow-hidden",
                    color.name === "White" ? "border border-gray-200" : ""
                  )}
                  style={{ backgroundColor: color.value }}
                  onClick={() => handleToggleColor(color.name)}
                  aria-label={`Select ${color.name}`}
                >
                  {activeFilters.colors.includes(color.name) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="brand">
          <AccordionTrigger className="text-sm py-3">Brand</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {brands.map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={activeFilters.brands.includes(brand)}
                    onCheckedChange={() => handleToggleBrand(brand)}
                  />
                  <Label
                    htmlFor={`brand-${brand}`}
                    className="text-sm cursor-pointer flex-1"
                  >
                    {brand}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger className="text-sm py-3">
            Price Range (per day)
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2 px-1">
              <Slider
                value={[activeFilters.priceRange[0], activeFilters.priceRange[1]]}
                min={0}
                max={500}
                step={5}
                onValueChange={handlePriceChange}
                className="py-4"
              />
              <div className="flex justify-between items-center">
                <div className="w-20">
                  <Input
                    type="number"
                    value={activeFilters.priceRange[0]}
                    onChange={(e) =>
                      handlePriceChange([
                        parseInt(e.target.value),
                        activeFilters.priceRange[1],
                      ])
                    }
                    className="h-8"
                    min={0}
                    max={activeFilters.priceRange[1]}
                  />
                </div>
                <span className="text-sm text-muted-foreground">to</span>
                <div className="w-20">
                  <Input
                    type="number"
                    value={activeFilters.priceRange[1]}
                    onChange={(e) =>
                      handlePriceChange([
                        activeFilters.priceRange[0],
                        parseInt(e.target.value),
                      ])
                    }
                    className="h-8"
                    min={activeFilters.priceRange[0]}
                    max={500}
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );

  return (
    <div className="w-full mb-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Sort by Dropdown */}
        <div className="flex-1 min-w-[200px]">
          <Select
            value={sortOption}
            onValueChange={(value) => setSortOption(value)}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent align="start">
              <SelectItem value="recommended">Recommended</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="popularity">Popularity</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Desktop Filters */}
        <div className="hidden md:flex gap-3 flex-1 justify-end">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-2 px-1 min-w-5 h-5 rounded-full text-xs"
                  >
                    {activeFilterCount}
                  </Badge>
                )}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[300px] p-4"
              align="end"
            >
              <FilterContent />
              
              <div className="flex justify-between mt-4 pt-4 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="h-8"
                >
                  Clear all
                </Button>
                <Button size="sm" onClick={handleApplyFilters} className="h-8">
                  Apply Filters
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Mobile Filters */}
        <div className="flex md:hidden">
          <Sheet
            open={mobileFiltersOpen}
            onOpenChange={setMobileFiltersOpen}
          >
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-2 px-1 min-w-5 h-5 rounded-full text-xs"
                  >
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-md">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6 overflow-y-auto flex-1">
                <FilterContent />
              </div>
              <SheetFooter className="mt-6 flex justify-between border-t pt-4">
                <Button
                  variant="ghost"
                  onClick={handleClearFilters}
                >
                  Clear all
                </Button>
                <SheetClose asChild>
                  <Button onClick={handleApplyFilters}>Apply Filters</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Active Filters Pills */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {activeFilters.categories.map((category) => (
            <Badge
              key={`cat-${category}`}
              variant="secondary"
              className="px-3 py-1 h-7 rounded-full flex items-center gap-1"
            >
              {category}
              <button
                onClick={() => handleRemoveFilter("categories", category)}
                className="ml-1 rounded-full hover:bg-muted"
                aria-label={`Remove ${category} filter`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}

          {activeFilters.occasions.map((occasion) => (
            <Badge
              key={`occ-${occasion}`}
              variant="secondary"
              className="px-3 py-1 h-7 rounded-full flex items-center gap-1"
            >
              {occasion}
              <button
                onClick={() => handleRemoveFilter("occasions", occasion)}
                className="ml-1 rounded-full hover:bg-muted"
                aria-label={`Remove ${occasion} filter`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}

          {activeFilters.colors.map((color) => (
            <Badge
              key={`col-${color}`}
              variant="secondary"
              className="px-3 py-1 h-7 rounded-full flex items-center gap-1"
            >
              {color}
              <button
                onClick={() => handleRemoveFilter("colors", color)}
                className="ml-1 rounded-full hover:bg-muted"
                aria-label={`Remove ${color} filter`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}

          {activeFilters.sizes.map((size) => (
            <Badge
              key={`size-${size}`}
              variant="secondary"
              className="px-3 py-1 h-7 rounded-full flex items-center gap-1"
            >
              Size: {size}
              <button
                onClick={() => handleRemoveFilter("sizes", size)}
                className="ml-1 rounded-full hover:bg-muted"
                aria-label={`Remove ${size} filter`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}

          {activeFilters.brands.map((brand) => (
            <Badge
              key={`brand-${brand}`}
              variant="secondary"
              className="px-3 py-1 h-7 rounded-full flex items-center gap-1"
            >
              {brand}
              <button
                onClick={() => handleRemoveFilter("brands", brand)}
                className="ml-1 rounded-full hover:bg-muted"
                aria-label={`Remove ${brand} filter`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}

          {(activeFilters.priceRange[0] > 0 || activeFilters.priceRange[1] < 500) && (
            <Badge
              variant="secondary"
              className="px-3 py-1 h-7 rounded-full flex items-center gap-1"
            >
              ${activeFilters.priceRange[0]} - ${activeFilters.priceRange[1]}
              <button
                onClick={handleResetPriceRange}
                className="ml-1 rounded-full hover:bg-muted"
                aria-label="Reset price range"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="h-7 px-2 text-xs"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
