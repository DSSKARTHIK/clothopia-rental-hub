import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CreditCard,
  ShoppingBag,
  Truck,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { format } from "date-fns";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import AddressInput from "@/components/checkout/AddressInput";

export default function Checkout() {
  const [activeTab, setActiveTab] = useState("information");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { items, getSubtotal, clearCart } = useCart();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to the new shipping address page if coming from home
  useEffect(() => {
    if (items.length > 0 && location.pathname === '/checkout' && !location.state?.fromLegacy) {
      navigate('/shipping-address');
    }
  }, [items.length, location.pathname, location.state, navigate]);

  // Form fields
  const [formData, setFormData] = useState({
    name: profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    paymentMethod: "cash_on_delivery" as "cash_on_delivery" | "credit_card" | "debit_card" | "upi" | "net_banking",
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    upiId: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodChange = (value: string) => {
    setFormData((prev) => ({ ...prev, paymentMethod: value as any }));
  };

  const handleSubmitShipping = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate shipping information
    if (!formData.name || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.postalCode) {
      toast.error("Please fill in all required shipping information");
      return;
    }
    
    setActiveTab("payment");
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate payment information based on selected method
    if (formData.paymentMethod === "credit_card" || formData.paymentMethod === "debit_card") {
      if (!formData.cardName || !formData.cardNumber || !formData.cardExpiry || !formData.cardCvc) {
        toast.error("Please fill in all card details");
        setIsSubmitting(false);
        return;
      }
    } else if (formData.paymentMethod === "upi") {
      if (!formData.upiId) {
        toast.error("Please enter a valid UPI ID");
        setIsSubmitting(false);
        return;
      }
    }

    // Simulate payment processing
    setTimeout(() => {
      toast.success("Order placed successfully!");
      clearCart();
      navigate("/order-confirmation");
      setIsSubmitting(false);
    }, 1500);
  };

  const calculateDays = (start?: Date, end?: Date) => {
    if (!start || !end) return 1;
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const formatDate = (date?: Date) => {
    return date ? format(date, "MMM dd, yyyy") : "";
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-24 px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Button onClick={() => navigate("/browse")}>Browse Collection</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="mb-8">
                <h1 className="text-3xl font-bold">Checkout</h1>
                <p className="text-muted-foreground">
                  Complete your rental order
                </p>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="information">
                    <MapPin className="h-4 w-4 mr-2" />
                    Shipping
                  </TabsTrigger>
                  <TabsTrigger value="payment" disabled={activeTab === "information"}>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Payment
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="information">
                  <Card>
                    <CardHeader>
                      <CardTitle>Shipping Information</CardTitle>
                      <CardDescription>
                        Enter your shipping details
                      </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmitShipping}>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                              id="name"
                              name="name"
                              placeholder="John Doe"
                              required
                              value={formData.name}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="john@example.com"
                              required
                              value={formData.email}
                              onChange={handleChange}
                              disabled={!!user?.email}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            name="phone"
                            placeholder="10-digit mobile number"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address">Street Address</Label>
                          <Textarea
                            id="address"
                            name="address"
                            placeholder="House/Flat No, Building, Street, Area"
                            required
                            value={formData.address}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                              id="city"
                              name="city"
                              placeholder="Mumbai"
                              required
                              value={formData.city}
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
                              value={formData.state}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="postalCode">PIN Code</Label>
                            <Input
                              id="postalCode"
                              name="postalCode"
                              placeholder="400001"
                              required
                              value={formData.postalCode}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button type="submit" className="ml-auto">
                          Continue to Payment
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </form>
                  </Card>
                </TabsContent>
                <TabsContent value="payment">
                  <Card>
                    <CardHeader>
                      <CardTitle>Payment Information</CardTitle>
                      <CardDescription>
                        Select your preferred payment method
                      </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmitPayment}>
                      <CardContent className="space-y-6">
                        <RadioGroup 
                          value={formData.paymentMethod} 
                          onValueChange={handlePaymentMethodChange}
                          className="gap-4"
                        >
                          <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:bg-muted/50">
                            <RadioGroupItem value="cash_on_delivery" id="cod" />
                            <Label htmlFor="cod" className="cursor-pointer flex flex-col">
                              <span className="font-medium">Cash on Delivery</span>
                              <span className="text-sm text-muted-foreground">Pay when your rental arrives</span>
                            </Label>
                          </div>
                          
                          <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:bg-muted/50">
                            <RadioGroupItem value="credit_card" id="credit" />
                            <Label htmlFor="credit" className="cursor-pointer flex flex-col">
                              <span className="font-medium">Credit Card</span>
                              <span className="text-sm text-muted-foreground">Pay securely with your credit card</span>
                            </Label>
                          </div>
                          
                          <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:bg-muted/50">
                            <RadioGroupItem value="debit_card" id="debit" />
                            <Label htmlFor="debit" className="cursor-pointer flex flex-col">
                              <span className="font-medium">Debit Card</span>
                              <span className="text-sm text-muted-foreground">Pay directly from your bank account</span>
                            </Label>
                          </div>
                          
                          <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:bg-muted/50">
                            <RadioGroupItem value="upi" id="upi" />
                            <Label htmlFor="upi" className="cursor-pointer flex flex-col">
                              <span className="font-medium">UPI</span>
                              <span className="text-sm text-muted-foreground">Pay using Google Pay, PhonePe, or other UPI apps</span>
                            </Label>
                          </div>
                          
                          <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:bg-muted/50">
                            <RadioGroupItem value="net_banking" id="netbanking" />
                            <Label htmlFor="netbanking" className="cursor-pointer flex flex-col">
                              <span className="font-medium">Net Banking</span>
                              <span className="text-sm text-muted-foreground">Pay directly from your bank account</span>
                            </Label>
                          </div>
                        </RadioGroup>

                        {/* Card details form */}
                        {(formData.paymentMethod === "credit_card" || formData.paymentMethod === "debit_card") && (
                          <div className="space-y-4 border-t pt-4">
                            <div className="space-y-2">
                              <Label htmlFor="cardName">Name on Card</Label>
                              <Input
                                id="cardName"
                                name="cardName"
                                placeholder="Name on card"
                                value={formData.cardName}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cardNumber">Card Number</Label>
                              <Input
                                id="cardNumber"
                                name="cardNumber"
                                placeholder="1234 5678 9012 3456"
                                value={formData.cardNumber}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="cardExpiry">Expiry Date</Label>
                                <Input
                                  id="cardExpiry"
                                  name="cardExpiry"
                                  placeholder="MM/YY"
                                  value={formData.cardExpiry}
                                  onChange={handleChange}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="cardCvc">CVV</Label>
                                <Input
                                  id="cardCvc"
                                  name="cardCvc"
                                  placeholder="123"
                                  value={formData.cardCvc}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* UPI form */}
                        {formData.paymentMethod === "upi" && (
                          <div className="space-y-4 border-t pt-4">
                            <div className="space-y-2">
                              <Label htmlFor="upiId">UPI ID</Label>
                              <Input
                                id="upiId"
                                name="upiId"
                                placeholder="name@upi"
                                value={formData.upiId}
                                onChange={handleChange}
                              />
                              <p className="text-xs text-muted-foreground">Enter your UPI ID (e.g. name@okicici, phone@paytm)</p>
                            </div>
                          </div>
                        )}

                        {/* Net banking form would go here */}
                        {formData.paymentMethod === "net_banking" && (
                          <div className="space-y-4 border-t pt-4">
                            <p className="text-sm">Select your bank from the list and you will be redirected to your bank's website to complete the payment.</p>
                            {/* Bank selection would go here */}
                            <p className="text-xs text-muted-foreground">For demo purposes, we'll simulate the bank selection process</p>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setActiveTab("information")}
                        >
                          Back to Shipping
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full"></div>
                              Processing...
                            </>
                          ) : (
                            <>
                              Place Order
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </CardFooter>
                    </form>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    {items.map((item) => {
                      const days = calculateDays(item.rentalStart, item.rentalEnd);
                      const itemTotal = item.price * item.quantity * days;

                      return (
                        <div
                          key={`${item.id}-${item.size}-${item.rentalStart?.getTime()}`}
                          className="flex gap-3"
                        >
                          <div className="w-16 h-16 rounded-md overflow-hidden bg-muted">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h4 className="font-medium line-clamp-1 text-sm">
                                {item.name}
                              </h4>
                              <span className="font-medium text-sm">
                                ₹{itemTotal}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {item.size && `Size: ${item.size}`}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Qty: {item.quantity}{" "}
                              {item.rentalStart &&
                                item.rentalEnd &&
                                `for ${days} days`}
                            </div>
                            {item.rentalStart && item.rentalEnd && (
                              <div className="text-xs text-muted-foreground">
                                {formatDate(item.rentalStart)} -{" "}
                                {formatDate(item.rentalEnd)}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>₹{getSubtotal()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Insurance</span>
                      <span>₹0</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Delivery</span>
                      <span>₹0</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>₹{getSubtotal()}</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <div className="flex items-start gap-2 text-sm">
                      <Truck className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div>
                        <p>Estimated delivery 1-3 days before rental start date</p>
                        <p className="text-muted-foreground">
                          Free shipping on all orders
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
