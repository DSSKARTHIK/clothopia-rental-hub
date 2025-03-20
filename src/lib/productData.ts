
// Mock data for clothing items - shared between browse and detail pages
export const MOCK_CLOTHING = [
  {
    id: "1",
    name: "Floral Print Maxi Dress",
    price: 56,
    retailPrice: 320,
    image: "https://images.unsplash.com/photo-1619161519929-6d149fdcc661?q=80&w=2787&auto=format&fit=crop",
    brand: "Gucci",
    category: "Dresses",
    isNew: true,
    description: "This stunning floral print maxi dress is perfect for summer events, garden parties, or elegant evenings out. The premium fabric and flattering silhouette make it a standout choice for any occasion."
  },
  {
    id: "2",
    name: "Classic Black Tuxedo",
    price: 89,
    retailPrice: 450,
    image: "https://images.unsplash.com/photo-1556032743-4a05cf119e8f?q=80&w=2835&auto=format&fit=crop",
    brand: "Armani",
    category: "Suits",
    description: "A timeless classic black tuxedo that offers sophistication and elegance for formal events. Tailored to perfection with premium materials."
  },
  {
    id: "3",
    name: "Silk Evening Gown",
    price: 75,
    retailPrice: 380,
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=2830&auto=format&fit=crop",
    brand: "Versace",
    category: "Dresses",
    description: "An exquisite silk evening gown that exudes luxury and grace. Designed with attention to detail and crafted from the finest silk."
  },
  {
    id: "4",
    name: "Casual Linen Blazer",
    price: 45,
    retailPrice: 220,
    image: "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?q=80&w=2938&auto=format&fit=crop",
    brand: "Zara",
    category: "Outerwear",
    isNew: true,
    description: "A versatile linen blazer perfect for casual or semi-formal occasions. Lightweight and comfortable for year-round wear."
  },
  {
    id: "5",
    name: "Sequin Cocktail Dress",
    price: 70,
    retailPrice: 350,
    image: "https://images.unsplash.com/photo-1596703263926-eb0762ee17e4?q=80&w=2787&auto=format&fit=crop",
    brand: "Prada",
    category: "Dresses",
    description: "Make a statement with this dazzling sequin cocktail dress. Perfect for parties and evening events where you want to shine."
  },
  {
    id: "6",
    name: "Navy Blue Suit",
    price: 85,
    retailPrice: 420,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=2784&auto=format&fit=crop",
    brand: "Hugo Boss",
    category: "Suits",
    description: "A sophisticated navy blue suit that combines classic styling with modern tailoring. Versatile enough for both business and formal occasions."
  },
  {
    id: "7",
    name: "Crystal Embellished Clutch",
    price: 30,
    retailPrice: 150,
    image: "https://images.unsplash.com/photo-1601924638867-3a6de6b7a500?q=80&w=2770&auto=format&fit=crop",
    brand: "Chanel",
    category: "Accessories",
    isNew: true,
    description: "An elegant crystal embellished clutch that adds a touch of glamour to any outfit. Perfect for special occasions and evening events."
  },
  {
    id: "8",
    name: "Leather Biker Jacket",
    price: 55,
    retailPrice: 275,
    image: "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?q=80&w=2923&auto=format&fit=crop",
    brand: "Saint Laurent",
    category: "Outerwear",
    description: "A classic leather biker jacket that never goes out of style. Crafted from premium leather with attention to detail and durability."
  },
  {
    id: "9",
    name: "Velvet Formal Dress",
    price: 60,
    retailPrice: 300,
    image: "https://images.unsplash.com/photo-1623609163859-ca93c959b98a?q=80&w=2787&auto=format&fit=crop",
    brand: "Dolce & Gabbana",
    category: "Dresses",
    description: "A luxurious velvet formal dress that combines elegance with comfort. The rich texture adds depth and sophistication to your look."
  },
  {
    id: "10",
    name: "Charcoal Gray Suit",
    price: 80,
    retailPrice: 400,
    image: "https://images.unsplash.com/photo-1593032465175-481ac7f401a0?q=80&w=2940&auto=format&fit=crop",
    brand: "Tom Ford",
    category: "Suits",
    isNew: true,
    description: "A premium charcoal gray suit that offers versatility and style. Perfect for business meetings, formal events, or special occasions."
  },
  {
    id: "11",
    name: "Off-Shoulder Satin Gown",
    price: 95,
    retailPrice: 475,
    image: "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?q=80&w=2874&auto=format&fit=crop",
    brand: "Valentino",
    category: "Dresses",
    description: "An elegant off-shoulder satin gown that creates a stunning silhouette. The flowing design and premium fabric make it perfect for galas and formal events."
  },
  {
    id: "12",
    name: "Designer Bow Tie",
    price: 15,
    retailPrice: 75,
    image: "https://images.unsplash.com/photo-1607541602069-fef603da2be3?q=80&w=2781&auto=format&fit=crop",
    brand: "Fendi",
    category: "Accessories",
    description: "A sophisticated designer bow tie that adds the perfect finishing touch to formal attire. Crafted with precision and attention to detail."
  },
];

// Function to get product by ID
export function getProductById(id: string) {
  return MOCK_CLOTHING.find(product => product.id === id) || null;
}

// Function to get related products (same category but different ID)
export function getRelatedProducts(id: string, category: string, limit: number = 4) {
  return MOCK_CLOTHING
    .filter(product => product.id !== id && product.category === category)
    .slice(0, limit);
}
