
import { useState } from "react";
import { useToast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLayout from "@/components/admin/AdminLayout";
import ProductManagement from "@/components/admin/ProductManagement";
import InventoryManagement from "@/components/admin/InventoryManagement";
import RentalManagement from "@/components/admin/RentalManagement";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("products");
  
  return (
    <AdminLayout>
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <Tabs defaultValue="products" onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="rentals">Rentals</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products">
            <ProductManagement />
          </TabsContent>
          
          <TabsContent value="inventory">
            <InventoryManagement />
          </TabsContent>
          
          <TabsContent value="rentals">
            <RentalManagement />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
