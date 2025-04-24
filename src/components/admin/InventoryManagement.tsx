import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Product, InventoryItem } from "@/types/database";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Search, ArrowUpDown, Package, AlertTriangle } from "lucide-react";
import { MOCK_CLOTHING } from "@/lib/productData";

export default function InventoryManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const queryClient = useQueryClient();

  // Fetch inventory with products
  const { data: inventory = [], isLoading } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const { data: inventoryData, error: inventoryError } = await supabase
        .from('inventory')
        .select(`
          *,
          products (*)
        `);
      
      if (inventoryError) throw inventoryError;
      
      return inventoryData.map(item => ({
        ...item,
        product: item.products as Product
      }));
    }
  });

  // Update inventory mutation
  const updateInventoryMutation = useMutation({
    mutationFn: async ({ id, total_stock }: { id: string; total_stock: number }) => {
      const { data, error } = await supabase
        .from('inventory')
        .update({ total_stock })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success("Inventory updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update inventory: " + error.message);
    }
  });

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };
  
  const filteredInventory = inventory.filter((item: any) => 
    item.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.product.category.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a: any, b: any) => {
    const aValue = a.product[sortBy as keyof typeof a.product];
    const bValue = b.product[sortBy as keyof typeof b.product];
    
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });
  
  const lowStockItems = inventory.filter((item: any) => item.total_stock <= 3).length;
  const totalItems = inventory.reduce((acc: number, item: any) => acc + item.total_stock, 0);
  const rentedItems = inventory.reduce((acc: number, item: any) => acc + (item.total_stock - item.available_stock), 0);
  
  const updateStock = (id: string, newStock: number) => {
    updateInventoryMutation.mutate({ id: id, total_stock: newStock });
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Inventory Management</h2>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems} items</div>
            <p className="text-xs text-muted-foreground">
              Across {inventory.length} unique products
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Currently Rented</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rentedItems} items</div>
            <p className="text-xs text-muted-foreground">
              {((rentedItems / totalItems) * 100).toFixed(1)}% of total inventory
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alert</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockItems} products</div>
            <p className="text-xs text-muted-foreground">
              Need to be restocked soon
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex items-center space-x-2 w-full max-w-sm">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search inventory..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Filter by:</span>
          <Select defaultValue="all">
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="dresses">Dresses</SelectItem>
              <SelectItem value="suits">Suits</SelectItem>
              <SelectItem value="outerwear">Outerwear</SelectItem>
              <SelectItem value="accessories">Accessories</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  onClick={() => toggleSort("category")}
                  className="flex items-center gap-1"
                >
                  Category
                  <ArrowUpDown className="h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  onClick={() => toggleSort("total_stock")}
                  className="flex items-center gap-1"
                >
                  Total Stock
                  <ArrowUpDown className="h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  onClick={() => toggleSort("available_stock")}
                  className="flex items-center gap-1"
                >
                  Available
                  <ArrowUpDown className="h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInventory.map((item: any) => (
              <TableRow key={item.id} className={item.total_stock <= 3 ? "bg-amber-50" : ""}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 overflow-hidden rounded-md">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{item.product.name}</div>
                      <div className="text-sm text-muted-foreground">{item.product.brand}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{item.product.category}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number" 
                      value={item.total_stock} 
                      className="w-16"
                      min={0}
                      onChange={(e) => {
                        const newStock = parseInt(e.target.value);
                        if (!isNaN(newStock) && newStock >= 0) {
                          updateStock(item.id, newStock);
                        }
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <span className={item.available_stock === 0 ? "text-destructive" : ""}>
                    {item.available_stock} / {item.total_stock}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">Update</Button>
                </TableCell>
              </TableRow>
            ))}
            
            {filteredInventory.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  No inventory items found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
