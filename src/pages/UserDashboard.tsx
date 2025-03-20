
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import UserActivity from "@/components/user/UserActivity";
import RentalHistory from "@/components/user/RentalHistory";
import { Shield, User, Calendar, History } from "lucide-react";

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("activity");
  
  // Mock user data (would come from auth context in a real app)
  const user = {
    name: "Alex Johnson",
    email: "alex@example.com",
    memberSince: "January 2023",
    profileImage: "https://i.imgur.com/VDEir9X.jpg"
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* User Profile Summary */}
            <div className="w-full md:w-1/3 lg:w-1/4">
              <Card>
                <CardHeader className="space-y-2 text-center">
                  <div className="relative mx-auto w-24 h-24 rounded-full overflow-hidden mb-2">
                    <img 
                      src={user.profileImage} 
                      alt={user.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <CardTitle>{user.name}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                  <p className="text-sm text-muted-foreground">Member since {user.memberSince}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center gap-2 py-2">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <span>Profile Settings</span>
                    </div>
                    <div className="flex items-center gap-2 py-2">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <span>Upcoming Rentals</span>
                    </div>
                    <div className="flex items-center gap-2 py-2">
                      <Shield className="h-5 w-5 text-muted-foreground" />
                      <span>Security Settings</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Stats Card */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-base">Your Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Rentals</span>
                    <span className="font-medium">12</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Active Rentals</span>
                    <span className="font-medium">1</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Money Saved</span>
                    <span className="font-medium">~$1,245</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="w-full md:w-2/3 lg:w-3/4">
              <Tabs 
                defaultValue="activity" 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="w-full md:w-auto mb-6">
                  <TabsTrigger value="activity" className="flex gap-2">
                    <History className="h-4 w-4" />
                    Recent Activity
                  </TabsTrigger>
                  <TabsTrigger value="history" className="flex gap-2">
                    <Calendar className="h-4 w-4" />
                    Rental History
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="activity" className="pt-4">
                  <UserActivity />
                </TabsContent>
                
                <TabsContent value="history" className="pt-4">
                  <RentalHistory />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
