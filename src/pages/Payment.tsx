import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CreditCard, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/contexts/CartContext";

export default function Payment() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("cash_on_delivery");
  const { clearCart, getSubtotal, formatCurrency } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  
  console.log("Payment page loaded with location state:", location.state);
  
  const { shippingDetails } = location.state || {};

  // Redirect to shipping if no shipping details
  useEffect(() => {
    if (!shippingDetails) {
      console.log("No shipping details found, redirecting to shipping page");
      toast.error("Please select a shipping address first");
      navigate('/shipping-address');
    }
  }, [shippingDetails, navigate]);

  const [formData, setFormData] = useState({
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate payment information based on selected method
    if (paymentMethod === "credit_card" || paymentMethod === "debit_card") {
      if (!formData.cardName || !formData.cardNumber || !formData.cardExpiry || !formData.cardCvc) {
        toast.error("Please fill in all card details");
        setIsSubmitting(false);
        return;
      }
    } else if (paymentMethod === "upi") {
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

  // Calculate total and shipping information for display
  const subtotal = getSubtotal();
  const shipping = 0;
  const total = subtotal + shipping;

  // If no shipping details and not in the process of redirecting, show a loading state
  if (!shippingDetails) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-24 px-4 md:px-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Redirecting to shipping address...</p>
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
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Payment</h1>
            <p className="text-muted-foreground">Choose your payment method</p>
          </div>

          <div className="grid gap-6 md:grid-cols-5">
            {/* Payment form - 3 columns */}
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
                <CardDescription>
                  Select your preferred payment method
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                  <RadioGroup 
                    value={paymentMethod} 
                    onValueChange={setPaymentMethod}
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
                  {(paymentMethod === "credit_card" || paymentMethod === "debit_card") && (
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
                  {paymentMethod === "upi" && (
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
                  {paymentMethod === "net_banking" && (
                    <div className="space-y-4 border-t pt-4">
                      <p className="text-sm">Select your bank from the list and you will be redirected to your bank's website to complete the payment.</p>
                      <p className="text-xs text-muted-foreground">For demo purposes, we'll simulate the bank selection process</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/shipping-address')}
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

            {/* Order Summary - 2 columns */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Shipping Address Summary */}
                  {shippingDetails && (
                    <div className="space-y-2">
                      <div className="font-medium">Shipping to:</div>
                      <div className="text-sm border rounded-md p-3 bg-muted/50">
                        <div>{shippingDetails.name}</div>
                        <div>{shippingDetails.street}</div>
                        <div>{shippingDetails.city}, {shippingDetails.state} {shippingDetails.postal_code}</div>
                        <div>Phone: {shippingDetails.phone}</div>
                      </div>
                    </div>
                  )}

                  {/* Cost breakdown */}
                  <div className="space-y-2">
                    <div className="font-medium">Price Details:</div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{formatCurrency(subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>{formatCurrency(shipping)}</span>
                      </div>
                      <div className="border-t pt-1 mt-1 font-medium flex justify-between">
                        <span>Total</span>
                        <span>{formatCurrency(total)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
