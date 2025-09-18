import { isLoggedIn } from "@/lib/auth";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  // if user not logged in, redirect to /
  return isLoggedIn() ? <Outlet /> : <Navigate to="/" replace />;
}
