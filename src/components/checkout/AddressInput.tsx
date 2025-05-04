
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Address } from "@/types/database";
import { CheckCircle } from "lucide-react";

interface AddressInputProps {
  onAddressSelect: (address: Address | null) => void;
  savedAddresses?: Address[];
}

export default function AddressInput({ onAddressSelect, savedAddresses = [] }: AddressInputProps) {
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    savedAddresses.length > 0 ? savedAddresses.find(addr => addr.is_default)?.id || savedAddresses[0].id : null
  );
  const [showNewAddressForm, setShowNewAddressForm] = useState(savedAddresses.length === 0);
  
  const [newAddress, setNewAddress] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    postal_code: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectAddress = (addressId: string) => {
    setSelectedAddressId(addressId);
    setShowNewAddressForm(false);
    
    const selected = savedAddresses.find(addr => addr.id === addressId) || null;
    onAddressSelect(selected);
  };

  const handleNewAddressClick = () => {
    setSelectedAddressId(null);
    setShowNewAddressForm(true);
    onAddressSelect(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to database
    // For now, we'll just pass it up to the parent
    onAddressSelect(newAddress as unknown as Address);
  };

  return (
    <div className="space-y-6">
      {savedAddresses.length > 0 && (
        <div className="space-y-4">
          <div className="text-lg font-medium">Saved Addresses</div>
          <div className="grid gap-4 sm:grid-cols-2">
            {savedAddresses.map(address => (
              <div
                key={address.id}
                className={`border rounded-lg p-4 cursor-pointer relative ${
                  selectedAddressId === address.id ? 'border-primary ring-1 ring-primary' : ''
                }`}
                onClick={() => handleSelectAddress(address.id)}
              >
                <div className="font-medium">{address.name}</div>
                <div className="text-sm text-muted-foreground mt-1">{address.street}</div>
                <div className="text-sm text-muted-foreground">
                  {address.city}, {address.state} {address.postal_code}
                </div>
                <div className="text-sm mt-1">Phone: {address.phone}</div>
                
                {selectedAddressId === address.id && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                )}
                
                {address.is_default && (
                  <div className="absolute bottom-2 right-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      Default
                    </span>
                  </div>
                )}
              </div>
            ))}
            
            <div
              className={`border border-dashed rounded-lg p-4 flex items-center justify-center cursor-pointer hover:bg-muted/50 ${
                showNewAddressForm ? 'border-primary ring-1 ring-primary' : ''
              }`}
              onClick={handleNewAddressClick}
            >
              <div className="text-center">
                <div className="font-medium">+ Add New Address</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {(showNewAddressForm || savedAddresses.length === 0) && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-lg font-medium">
            {savedAddresses.length > 0 ? "New Address" : "Shipping Address"}
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                required
                value={newAddress.name}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="street">Street Address</Label>
              <Textarea
                id="street"
                name="street"
                placeholder="House/Flat No, Building, Street, Area"
                required
                value={newAddress.street}
                onChange={handleChange}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  placeholder="Mumbai"
                  required
                  value={newAddress.city}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name="state"
                  placeholder="Maharashtra"
                  required
                  value={newAddress.state}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="postal_code">PIN Code</Label>
                <Input
                  id="postal_code"
                  name="postal_code"
                  placeholder="400001"
                  required
                  value={newAddress.postal_code}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="10-digit mobile number"
                  required
                  value={newAddress.phone}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button type="submit">Save & Use This Address</Button>
          </div>
        </form>
      )}
    </div>
  );
}
