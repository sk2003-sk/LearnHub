import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import StartupLoaderCleanup from "./components/StartupLoaderCleanup";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Suspense>
      <StartupLoaderCleanup />
      <AuthProvider>
        <App />
      </AuthProvider>
    </Suspense>
  </StrictMode>,
);
