
import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ClothingCardProps {
  id: string;
  name: string;
  price: number;
  retailPrice?: number;
  image: string;
  brand: string;
  category: string;
  isFavorite?: boolean;
  isNew?: boolean;
}

export default function ClothingCard({
  id,
  name,
  price,
  retailPrice,
  image,
  brand,
  category,
  isFavorite = false,
  isNew = false,
}: ClothingCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [favorite, setFavorite] = useState(isFavorite);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorite(!favorite);
  };

  return (
    <div className="group card-hover rounded-xl border overflow-hidden bg-card">
      <Link to={`/clothing/${id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <img
            src={image}
            alt={name}
            className={cn(
              "object-cover w-full h-full transition-all duration-500 ease-apple",
              imageLoaded ? "image-loaded" : "image-loading",
              "group-hover:scale-105"
            )}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Favorite button */}
          <button
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors z-10"
            onClick={toggleFavorite}
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={cn("h-4 w-4", favorite ? "fill-red-500 text-red-500" : "text-muted-foreground")} />
          </button>
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {isNew && (
              <Badge className="bg-primary text-primary-foreground text-xs font-medium">
                New
              </Badge>
            )}
            {retailPrice && (
              <Badge variant="secondary" className="text-xs font-medium">
                {Math.round(((retailPrice - price) / retailPrice) * 100)}% Off
              </Badge>
            )}
          </div>
        </div>

        <div className="p-4">
          <div className="text-xs text-muted-foreground mb-1">{brand}</div>
          <h3 className="font-medium text-sm line-clamp-1">{name}</h3>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-medium">${price}/day</span>
            {retailPrice && (
              <span className="text-xs text-muted-foreground line-through">
                ${retailPrice}
              </span>
            )}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button size="sm" variant="outline" className="text-xs h-8 w-full">
              <Calendar className="mr-1 h-3 w-3" />
              Rent Now
            </Button>
            <Button size="sm" className="text-xs h-8 w-full">
              View Details
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
}
