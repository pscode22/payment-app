import { ThemeProvider } from "@/components/theme-provider"
import { RouterProvider } from "react-router-dom"
import { appRouter } from "./routes"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={appRouter} />
    </ThemeProvider>
  )
}

export default App