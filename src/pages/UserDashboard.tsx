
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import UserActivity from "@/components/user/UserActivity";
import RentalHistory from "@/components/user/RentalHistory";
import { Shield, User, Calendar, History, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const profileSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("activity");
  const { user, profile, isLoading, updateProfile } = useAuth();
  const navigate = useNavigate();
  
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: profile?.first_name || "",
      last_name: profile?.last_name || "",
    },
  });

  // Update form when profile data changes
  useEffect(() => {
    if (profile) {
      profileForm.reset({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
      });
    }
  }, [profile, profileForm]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    }
  }, [user, isLoading, navigate]);

  const onProfileSubmit = async (data: ProfileFormValues) => {
    try {
      await updateProfile({
        first_name: data.first_name,
        last_name: data.last_name,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4 mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* User Profile Summary */}
            <div className="w-full md:w-1/3 lg:w-1/4">
              <Card>
                <CardHeader className="space-y-2 text-center">
                  <div className="relative mx-auto w-24 h-24 rounded-full overflow-hidden mb-2 bg-muted flex items-center justify-center">
                    {profile?.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt={profile?.first_name || "User"}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <User className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>
                  <CardTitle>{profile?.first_name ? `${profile.first_name} ${profile.last_name || ""}` : "Welcome!"}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                  <p className="text-sm text-muted-foreground">
                    Member since {new Date(user.created_at || Date.now()).toLocaleDateString()}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-2">
                    <Button 
                      variant="ghost" 
                      className="justify-start" 
                      onClick={() => setActiveTab("profile")}
                    >
                      <User className="h-5 w-5 text-muted-foreground mr-2" />
                      <span>Profile Settings</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="justify-start"
                      onClick={() => setActiveTab("history")}
                    >
                      <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
                      <span>Rental History</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="justify-start"
                    >
                      <Shield className="h-5 w-5 text-muted-foreground mr-2" />
                      <span>Security Settings</span>
                    </Button>
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
                value={activeTab} 
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
                  <TabsTrigger value="profile" className="flex gap-2">
                    <Settings className="h-4 w-4" />
                    Profile
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="activity" className="pt-4">
                  <UserActivity />
                </TabsContent>
                
                <TabsContent value="history" className="pt-4">
                  <RentalHistory />
                </TabsContent>

                <TabsContent value="profile" className="pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription>
                        Update your profile information
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...profileForm}>
                        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormField
                              control={profileForm.control}
                              name="first_name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>First Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="John" {...field} value={field.value || ""} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={profileForm.control}
                              name="last_name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Last Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Doe" {...field} value={field.value || ""} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input disabled value={user.email || ""} />
                            </FormControl>
                            <p className="text-sm text-muted-foreground">
                              Email address cannot be changed
                            </p>
                          </FormItem>

                          <div className="flex justify-end">
                            <Button type="submit">
                              Save Changes
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
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
