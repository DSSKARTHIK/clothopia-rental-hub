
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function OrderConfirmation() {
  // For a real app, you would get the order details from a state management system or API
  const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 mx-auto mb-4 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Order Confirmed!
          </h1>
          <p className="text-xl mb-2">Thank you for your order</p>
          <p className="text-muted-foreground mb-6">
            Your order number is: <span className="font-medium">{orderNumber}</span>
          </p>

          <div className="mb-8 bg-muted p-6 rounded-xl text-left">
            <h2 className="font-medium mb-4">What happens next?</h2>
            <ol className="space-y-6">
              <li className="flex gap-4">
                <div className="flex-none w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
                  1
                </div>
                <div>
                  <h3 className="font-medium mb-1">Order Processing</h3>
                  <p className="text-muted-foreground text-sm">
                    We're preparing your items for delivery. You'll receive an email confirmation with tracking details soon.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-none w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
                  2
                </div>
                <div>
                  <h3 className="font-medium mb-1">Delivery</h3>
                  <p className="text-muted-foreground text-sm">
                    Your rental items will be delivered 1-2 days before your rental start date. We'll ensure everything arrives in perfect condition.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-none w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
                  3
                </div>
                <div>
                  <h3 className="font-medium mb-1">Return</h3>
                  <p className="text-muted-foreground text-sm">
                    On your rental end date, simply place your items in the provided packaging and schedule a pickup through your account or the confirmation email.
                  </p>
                </div>
              </li>
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline">
              <Link to="/dashboard">
                View Order Details
              </Link>
            </Button>
            <Button asChild>
              <Link to="/browse">
                Continue Shopping
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
