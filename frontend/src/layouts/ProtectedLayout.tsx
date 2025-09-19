import { Outlet } from "react-router-dom";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedLayout() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors flex flex-col">
      {/* 📱 Header */}
      <header className="p-4 flex justify-between items-center border-b">
        <h1 className="text-lg font-bold">⚡ MyApp</h1>
        <div className="flex items-center gap-2">
          <ModeToggle />
          {isAuthenticated && (
            <Button variant="outline" size="sm" onClick={logout}>
              🚪 Logout
            </Button>
          )}
        </div>
      </header>

      {/* 📱 Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <Outlet />
      </main>

      {/* 📱 Footer */}
      <footer className="text-center p-4 text-sm text-muted-foreground">
        © {new Date().getFullYear()} PaymentApp. All rights reserved.
      </footer>
    </div>
  );
}
