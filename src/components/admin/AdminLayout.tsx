
import { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  // This would be replaced with actual auth check
  const isAdmin = true;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container flex items-center justify-center">
          <Alert variant="destructive" className="max-w-lg">
            <Info className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You don't have permission to access the admin area.
            </AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="bg-primary/10 py-3 px-4">
        <div className="container flex items-center text-sm">
          <span className="font-medium">Admin Area</span>
        </div>
      </div>
      <Separator />
      <main className="flex-1">{children}</main>
    </div>
  );
}
