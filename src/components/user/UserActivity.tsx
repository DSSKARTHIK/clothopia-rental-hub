
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Clock, Calendar, AlertCircle, ShoppingBag, Heart, Package } from "lucide-react";

// Mock activity data
const RECENT_ACTIVITIES = [
  {
    id: 1,
    type: "return",
    item: "Floral Print Maxi Dress",
    date: "2023-11-15",
    status: "completed",
    message: "Return processed successfully",
    icon: Check,
  },
  {
    id: 2,
    type: "rental",
    item: "Classic Black Tuxedo",
    date: "2023-11-10",
    status: "active",
    message: "In progress, due in 3 days",
    icon: Clock,
  },
  {
    id: 3,
    type: "booking",
    item: "Silk Evening Gown",
    date: "2023-11-05",
    status: "upcoming",
    message: "Scheduled for Nov 20",
    icon: Calendar,
  },
  {
    id: 4,
    type: "review",
    item: "Casual Linen Blazer",
    date: "2023-10-28",
    status: "completed",
    message: "You left a 5-star review",
    icon: Check,
  },
  {
    id: 5,
    type: "issue",
    item: "Crystal Embellished Clutch",
    date: "2023-10-15",
    status: "resolved",
    message: "Size issue resolved with store credit",
    icon: AlertCircle,
  },
  {
    id: 6,
    type: "wishlist",
    item: "Sequin Cocktail Dress",
    date: "2023-10-10",
    status: "saved",
    message: "Added to your wishlist",
    icon: Heart,
  },
];

export default function UserActivity() {
  // Function to get icon color based on activity status
  const getIconColor = (status: string) => {
    switch (status) {
      case "completed":
      case "resolved":
        return "text-green-500";
      case "active":
        return "text-blue-500";
      case "upcoming":
        return "text-yellow-500";
      case "saved":
        return "text-pink-500";
      default:
        return "text-gray-500";
    }
  };
  
  // Function to get activity icon
  const getIcon = (type: string) => {
    switch (type) {
      case "return":
        return Package;
      case "rental":
      case "booking":
        return ShoppingBag;
      case "wishlist":
        return Heart;
      case "issue":
        return AlertCircle;
      case "review":
        return Check;
      default:
        return Clock;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your recent interactions and rental activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {RECENT_ACTIVITIES.map((activity) => {
              const ActivityIcon = getIcon(activity.type);
              return (
                <div key={activity.id} className="flex items-start gap-3 py-3">
                  <div className={`p-2 rounded-full bg-muted ${getIconColor(activity.status)}`}>
                    <ActivityIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{activity.item}</h4>
                    <p className="text-sm text-muted-foreground">{activity.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(activity.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
