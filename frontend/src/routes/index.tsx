import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";

import ProtectedLayout from "@/layouts/ProtectedLayout";
import PublicLayout from "@/layouts/PublicLayout";

import Home from "@/pages/Home";
import Signin from "@/pages/Signin";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import Send from "@/pages/Send";
import { useAuth } from "@/context/AuthContext";
import type { JSX } from "react";

// 🛡 Private route
const PrivateRoute = ({ element }: { element: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to="/" />;
};

// 🛡 Public route
const PublicRoute = ({ element }: { element: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" /> : element;
};

export const appRouter = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<PublicRoute element={<Home />} />} />
        <Route path="/signin" element={<PublicRoute element={<Signin />} />} />
        <Route path="/signup" element={<PublicRoute element={<Signup />} />} />
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/send" element={<PrivateRoute element={<Send />} />} />
      </Route>
    </>
  )
);
