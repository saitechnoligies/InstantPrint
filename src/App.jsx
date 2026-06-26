import React, { useState } from "react";
import Nav from "./components/Nav";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./components/RootLayout";
import OtpPage from "./pages/OtpPage";
import UploadPage from "./pages/UploadPage";
import OptionsPage from "./pages/OptionsPage";
import PaymentPage from "./pages/PaymentPage";
import SuccessPage from "./pages/SuccessPage";
import OrdersPage from "./pages/OrdersPage";
import "./App.css";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";

import IntroLoader from "./components/IntroLoader"; // 🔥 Import the new loader

function App() {
  // 🔥 Check storage immediately on load so it doesn't flash if they've already seen it
  const [introFinished, setIntroFinished] = useState(
    () => sessionStorage.getItem("hasSeenIntro") === "true"
  );

  const browserRouterObj = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { path: "/", element: <HomePage /> },
        { path: "/upload", element: <UploadPage /> },
        { path: "/options", element: <OptionsPage /> },
        { path: "/payment/:orderId", element: <PaymentPage /> },
        { path: "/success/:orderId", element: <SuccessPage /> },
        { path: "/otp", element: <OtpPage /> },
        { path: "/orders", element: <OrdersPage /> },
        { path: "/admin", element: <AdminPage /> },
      ],
    },
  ]);

  return (
    <div className="min-h-screen bg-[#0C0B0A] text-white selection:bg-[#c9a66b]/30">
      
      {/* 🔥 The Cinematic Splash Screen */}
      {!introFinished && (
        <IntroLoader onComplete={() => setIntroFinished(true)} />
      )}

      {/* 🔥 The actual website (Hidden safely until intro is done) */}
      <div 
        className={`transition-opacity duration-1000 ${
          introFinished ? "opacity-100" : "opacity-0 h-screen overflow-hidden pointer-events-none"
        }`}
      >
        <RouterProvider router={browserRouterObj} />
      </div>

    </div>
  );
}

export default App;