import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { initTokens } from "./services/authTokens.ts";
// import { BrowserRouter } from 'react-router-dom';

// load tokens from localStorage into memory on app start
initTokens();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
