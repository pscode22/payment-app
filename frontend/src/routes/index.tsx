import ProtectedLayout from "@/layouts/ProtectedLayout";
import PublicLayout from "@/layouts/PublicLayout";
import ToasterLayout from "@/layouts/ToasterLayout"; // ✅

import Home from "@/pages/Home";
import Signin from "@/pages/Signin";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import Send from "@/pages/Send";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

export const appRouter = createBrowserRouter(
  createRoutesFromElements(
    // ✅ Wrap everything in ToasterLayout
    <Route element={<ToasterLayout />}>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/send" element={<Send />} />
      </Route>
    </Route>
  )
);
