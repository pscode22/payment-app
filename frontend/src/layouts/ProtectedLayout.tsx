import { Outlet, useNavigate } from "react-router-dom";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

export default function ProtectedLayout() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors flex flex-col">
      {/* 📱 Header */}
      <header className="p-4 flex justify-between items-center border-b">
        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-[#FFD700] via-[#FFC300] to-[#FFA500] bg-clip-text text-transparent">
          FlowPay
        </h1>

        {/* <h1 className="text-2xl font-extrabold bg-gradient-to-r from-yellow-400 via-white to-[#00B894] bg-clip-text text-transparent">
            FlowPay
        </h1> */}

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
        {/* {children ?? <Outlet />} */}
        <Outlet />
      </main>

      {/* 📱 Footer */}
      {/* <footer className="text-center p-4 text-sm text-muted-foreground">
        © {new Date().getFullYear()} PaymentApp. All rights reserved.
      </footer> */}
    </div>
  );
}
