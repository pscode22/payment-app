import { ThemeProvider } from "@/components/theme-provider";
import { RouterProvider } from "react-router-dom";
import { appRouter } from "./routes";
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <UserProvider>
          <RouterProvider router={appRouter} />
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
