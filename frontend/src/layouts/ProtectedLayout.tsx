import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext"; // ✅ assuming you have this
import { useEffect } from "react";
import { LogOut, User } from "lucide-react";
import appIcon from "../assets/appIcon.svg";

export default function ProtectedLayout() {
  const { isAuthenticated, logout } = useAuth();
  const { user } = useUser(); // ✅ get user info
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors flex flex-col">
      {/* 📱 Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img
                src={appIcon}
                alt="app-icon"
                className="h-10 w-10 text-primary-foreground"
              />
              <div>
                <h1 className="text-xl font-semibold">FlowPay</h1>
                <p className="text-sm text-muted-foreground">
                  Welcome back, {user?.firstName || "User"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/profile")}
                className="h-9 w-9"
              >
                <User className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="h-9 w-9 text-muted-foreground hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* 📱 Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
