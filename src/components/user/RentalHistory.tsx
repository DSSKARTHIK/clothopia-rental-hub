
import { useState } from "react";
import { ChevronDown, ChevronUp, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock rental history data
const RENTAL_HISTORY = [
  {
    id: "RNT-1001",
    item: "Floral Print Maxi Dress",
    brand: "Gucci",
    image: "https://i.imgur.com/VGfHxMJ.jpg",
    startDate: "2023-10-10",
    endDate: "2023-10-13",
    status: "Completed",
    price: 65,
    retailPrice: 320,
  },
  {
    id: "RNT-1002",
    item: "Classic Black Tuxedo",
    brand: "Armani",
    image: "https://i.imgur.com/ZCnQGJD.jpg",
    startDate: "2023-10-25",
    endDate: "2023-10-28",
    status: "Active",
    price: 89,
    retailPrice: 450,
  },
  {
    id: "RNT-1003",
    item: "Silk Evening Gown",
    brand: "Versace",
    image: "https://i.imgur.com/U3qD5sM.jpg",
    startDate: "2023-09-05",
    endDate: "2023-09-08",
    status: "Completed",
    price: 75,
    retailPrice: 380,
  },
  {
    id: "RNT-1004",
    item: "Casual Linen Blazer",
    brand: "Zara",
    image: "https://i.imgur.com/JTOQ4L9.jpg",
    startDate: "2023-11-20",
    endDate: "2023-11-25",
    status: "Upcoming",
    price: 45,
    retailPrice: 220,
  },
  {
    id: "RNT-1005",
    item: "Crystal Embellished Clutch",
    brand: "Chanel",
    image: "https://i.imgur.com/ogtYBlC.jpg",
    startDate: "2023-08-15",
    endDate: "2023-08-19",
    status: "Completed",
    price: 30,
    retailPrice: 150,
  },
];

export default function RentalHistory() {
  const [expandedRental, setExpandedRental] = useState<string | null>(null);
  
  // Function to toggle expanded rental details
  const toggleExpand = (rentalId: string) => {
    if (expandedRental === rentalId) {
      setExpandedRental(null);
    } else {
      setExpandedRental(rentalId);
    }
  };
  
  // Function to format date string
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "active":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "upcoming":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Rental History</CardTitle>
          <CardDescription>
            View all your past, current, and upcoming rentals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {RENTAL_HISTORY.map((rental) => (
              <div key={rental.id} className="border rounded-lg overflow-hidden">
                <div 
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 cursor-pointer"
                  onClick={() => toggleExpand(rental.id)}
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto mb-3 sm:mb-0">
                    <div className="w-16 h-16 rounded-md overflow-hidden">
                      <img 
                        src={rental.image} 
                        alt={rental.item}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">{rental.item}</h4>
                      <p className="text-sm text-muted-foreground">{rental.brand}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
                    <Badge variant="outline" className={`${getStatusColor(rental.status)}`}>
                      {rental.status}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(rental.startDate)}</span>
                      <ArrowRight className="h-3 w-3 mx-1" />
                      <span>{formatDate(rental.endDate)}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="ml-auto" onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(rental.id);
                    }}>
                      {expandedRental === rental.id ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </div>
                
                {expandedRental === rental.id && (
                  <div className="px-4 pb-4 pt-0">
                    <Separator className="mb-4" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-medium mb-2">Rental Details</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Rental ID</span>
                            <span className="text-sm">{rental.id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Rental Price</span>
                            <span className="text-sm">${rental.price}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Retail Price</span>
                            <span className="text-sm">${rental.retailPrice}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">You Saved</span>
                            <span className="text-sm font-medium text-green-600">
                              ${rental.retailPrice - rental.price}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium mb-2">Actions</h5>
                        <div className="space-y-2">
                          {rental.status === "Completed" && (
                            <Button variant="outline" size="sm" className="w-full justify-start">
                              Rent Again
                            </Button>
                          )}
                          {(rental.status === "Active" || rental.status === "Upcoming") && (
                            <Button variant="outline" size="sm" className="w-full justify-start">
                              Manage Booking
                            </Button>
                          )}
                          <Button variant="secondary" size="sm" className="w-full justify-start">
                            View Details
                          </Button>
                          {rental.status === "Completed" && (
                            <Button variant="ghost" size="sm" className="w-full justify-start">
                              Leave Review
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
