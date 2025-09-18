import { Navigate, Outlet } from "react-router-dom";
import { isLoggedIn } from "@/lib/auth";

export default function PublicRoute() {
  // if user already logged in, redirect to /dashboard
  return isLoggedIn() ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
