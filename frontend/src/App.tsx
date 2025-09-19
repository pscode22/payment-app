import { ThemeProvider } from "@/components/theme-provider";
import { RouterProvider } from "react-router-dom";
import { appRouter } from "./routes";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <RouterProvider router={appRouter} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
