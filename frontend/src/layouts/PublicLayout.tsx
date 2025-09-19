import { Outlet } from "react-router-dom";
import { ModeToggle } from "@/components/mode-toggle";

export default function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Dark mode toggle top-right */}
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>

      {/* 📱 Content — full flex grow */}
      <main className="flex-1 flex items-center justify-center overflow-hidden">
        <Outlet />
      </main>

      {/* 📱 Footer fixed at bottom without adding scroll */}
      <footer className="shrink-0 text-center p-4 text-sm text-muted-foreground">
        © {new Date().getFullYear()} PaymentApp. All rights reserved.
      </footer>
    </div>
  );
}
