import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.jsx";

createRoot(
  document.getElementById("root")
).render(
  <StrictMode>
    <App />

    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3000,
        style: {
          background: "#0f172a",
          color: "#ffffff",
          border:
            "1px solid rgba(255,255,255,0.1)",
          borderRadius: "12px",
        },
      }}
    />
  </StrictMode>
);