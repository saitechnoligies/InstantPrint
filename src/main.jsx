import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ClerkProvider } from "@clerk/react";

console.log("CLERK:", import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
console.log("API:", import.meta.env.VITE_API_URL);
console.log("RAZORPAY:", import.meta.env.VITE_RAZORPAY_KEY_ID);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider>
      <App />
    </ClerkProvider>
  </StrictMode>,
);
