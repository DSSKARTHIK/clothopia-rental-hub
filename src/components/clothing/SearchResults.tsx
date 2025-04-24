
import { useState, useEffect } from "react";
import { MOCK_CLOTHING } from "@/lib/productData";
import ClothingGrid from "./ClothingGrid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";

interface SearchResultsProps {
  initialQuery?: string;
}

export default function SearchResults({ initialQuery = "" }: SearchResultsProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState(MOCK_CLOTHING);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(searchQuery);
  };

  useEffect(() => {
    if (query) {
      setIsSearching(true);
      // Simulate search delay
      const timer = setTimeout(() => {
        const filtered = MOCK_CLOTHING.filter(
          (item) =>
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.brand.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
        setIsSearching(false);
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setResults(MOCK_CLOTHING);
    }
  }, [query]);

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="mb-8">
        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
          <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
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

      {query && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">
            Search Results for "{query}"
          </h2>
          <p className="text-muted-foreground">
            {results.length} items found
          </p>
        </div>
      )}

      {isSearching ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <ClothingGrid items={results} />
      )}
    </div>
  );
}
