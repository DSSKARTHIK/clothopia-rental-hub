
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AddressInput from "@/components/checkout/AddressInput";
import { useCart } from "@/contexts/CartContext";
import { Address } from "@/types/database";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function ShippingAddress() {
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const { user, profile } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  // Demo saved addresses
  const savedAddresses: Address[] = [
    {
      id: "1",
      user_id: user?.id || "",
      name: profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : "Home Address",
      street: "123 Main Street, Apartment 4B",
      city: "Mumbai",
      state: "Maharashtra",
      postal_code: "400001",
      phone: "9876543210",
      is_default: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "2",
      user_id: user?.id || "",
      name: "Work Address",
      street: "456 Corporate Park, Building C",
      city: "Bengaluru",
      state: "Karnataka",
      postal_code: "560001",
      phone: "8765432109",
      is_default: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  ];

  // Auto-select a default address on page load
  useEffect(() => {
    const defaultAddress = savedAddresses.find(addr => addr.is_default) || savedAddresses[0];
    if (defaultAddress) {
      setSelectedAddress(defaultAddress);
    }
  }, []);

  const handleContinue = () => {
    if (!selectedAddress) {
      toast.error("Please select or add an address to continue");
      return;
    }
    
    console.log("Navigating to payment page with address:", selectedAddress);
    
    // Navigate to payment page with address details
    navigate('/payment', { 
      state: { shippingDetails: selectedAddress } 
    });
  };

  // Don't redirect empty cart if coming from checkout flow
  useEffect(() => {
    if (items.length === 0 && !window.location.search.includes('fromCheckout')) {
      console.log("Empty cart detected, redirecting to homepage");
      navigate('/');
    }
  }, [items, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Shipping Address</h1>
            <p className="text-muted-foreground">Where should we deliver your items?</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Select Delivery Address</CardTitle>
              <CardDescription>
                Choose from saved addresses or add a new one
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AddressInput 
                onAddressSelect={setSelectedAddress} 
                savedAddresses={savedAddresses} 
              />
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleContinue}>
                Continue to Payment
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
