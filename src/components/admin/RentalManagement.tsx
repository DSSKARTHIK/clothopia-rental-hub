
import { useState } from "react";
import { format, addDays, subDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Search, Calendar as CalendarIcon, Users, DollarSign } from "lucide-react";
import { MOCK_CLOTHING } from "@/lib/productData";

// Generate random rental data
const generateRentals = () => {
  const statuses = ["active", "pending", "completed", "cancelled"];
  const users = [
    "john.doe@example.com",
    "jane.smith@example.com", 
    "mike.johnson@example.com",
    "sarah.williams@example.com",
    "alex.brown@example.com"
  ];
  
  return MOCK_CLOTHING.slice(0, 8).map((item, index) => {
    const startDate = subDays(new Date(), Math.floor(Math.random() * 10));
    const endDate = addDays(startDate, Math.floor(Math.random() * 10) + 3);
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const user = users[Math.floor(Math.random() * users.length)];
    
    return {
      id: `rental-${index + 1}`,
      productId: item.id,
      productName: item.name,
      productImage: item.image,
      user,
      startDate,
      endDate,
      duration: Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)),
      status,
      totalPrice: Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) * item.price
    };
  });
};

export default function RentalManagement() {
  const [rentals, setRentals] = useState(generateRentals());
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const filteredRentals = rentals.filter(rental => {
    // Apply search filter
    const matchesSearch = 
      rental.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply status filter
    const matchesStatus = statusFilter === "all" || rental.status === statusFilter;
    
    // Apply date filter if a date is selected
    const matchesDate = !selectedDate || 
      (rental.startDate <= selectedDate && rental.endDate >= selectedDate);
    
    return matchesSearch && matchesStatus && matchesDate;
  });
  
  // Calculate statistics
  const activeRentals = rentals.filter(r => r.status === "active").length;
  const totalRevenue = rentals.reduce((sum, r) => sum + r.totalPrice, 0);
  const upcomingReturns = rentals.filter(r => 
    r.status === "active" && 
    r.endDate >= new Date() &&
    r.endDate <= addDays(new Date(), 3)
  ).length;
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "pending":
        return <Badge variant="outline" className="text-amber-600 border-amber-600">Pending</Badge>;
      case "completed":
        return <Badge variant="secondary">Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Rental Management</h2>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rentals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeRentals} rentals</div>
            <p className="text-xs text-muted-foreground">
              {upcomingReturns} returns due in next 3 days
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue}</div>
            <p className="text-xs text-muted-foreground">
              From {rentals.length} total rentals
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calendar View</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pl-2">
            <div className="text-xs text-muted-foreground mb-2">
              Select a date to filter rentals
            </div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex items-center space-x-2 w-full max-w-sm">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search rentals..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Status:</span>
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRentals.map((rental) => (
              <TableRow key={rental.id}>
                <TableCell className="font-medium">{rental.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-md">
                      <img 
                        src={rental.productImage} 
                        alt={rental.productName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="truncate max-w-[150px]">{rental.productName}</span>
                  </div>
                </TableCell>
                <TableCell>{rental.user}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{format(rental.startDate, "MMM d")}-{format(rental.endDate, "MMM d, yyyy")}</div>
                    <div className="text-muted-foreground">{rental.duration} days</div>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(rental.status)}</TableCell>
                <TableCell className="text-right">${rental.totalPrice}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">View</Button>
                </TableCell>
              </TableRow>
            ))}
            
            {filteredRentals.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  No rentals found for the selected filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
