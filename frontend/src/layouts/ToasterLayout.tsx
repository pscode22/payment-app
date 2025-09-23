import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

export default function ToasterLayout() {
  return (
    <div className="min-h-screen">
      {/* 📄 Render child layouts/pages */}
      <Outlet />

      {/* 🔔 Global toast container */}
      <Toaster position="bottom-right" richColors closeButton />
    </div>
  );
}
