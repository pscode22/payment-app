import { Outlet, useNavigate } from "react-router-dom";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import appIcon from "../assets/appIcon.svg";

export default function PublicLayout() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
      return;
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors flex flex-col">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <img
                src={appIcon}
                alt="FlowPay"
                className="h-8 w-8"
              />
              <span className="text-lg font-semibold">FlowPay</span>
            </div>

            {/* Theme Toggle */}
            <ModeToggle />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="shrink-0 border-t bg-card/30">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} FlowPay. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span>Trusted by users worldwide</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}