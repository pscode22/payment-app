import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import Signup from "./Signup";
import Signin from "./Signin";
import Dashboard from "./Dashboard";
import Send from "./Send";
import Home from "./Home";

const routeElements = [
  <Route path="/" element={<Home />} />,
  <Route path="/signup" element={<Signup />} />,
  <Route path="/signin" element={<Signin />} />,
  <Route path="/dashboard" element={<Dashboard />} />,
  <Route path="/send" element={<Send />} />,
];

export const appRouter = createBrowserRouter(
  createRoutesFromElements(routeElements)
);
