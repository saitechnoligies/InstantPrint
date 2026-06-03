import React from "react";
import Nav from "./components/Nav";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./components/RootLayout";
import OtpPage from "./pages/OtpPage";
import UploadPage from "./pages/UploadPage";
// import OptionsPage from "./pages/OptionsPage";
import PaymentPage from "./pages/PaymentPage";
import SuccessPage from "./pages/SuccessPage";

import "./App.css";
import HomePage from "./pages/HomePage";

function App() {
  const browserRouterObj = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/upload",
          element: <UploadPage />,
        },
        {
          path: "/options",
          element: <div>Options</div>,
        },
        {
          path: "/payment/:orderId",
          element: <PaymentPage />,
        },
        {
          path: "/success/:orderId",
          element: <SuccessPage />,
        },

        {
          path: "/otp",
          element: <OtpPage />,
        },
      ],
    },
  ]);

  return (
    <div>
      <RouterProvider router={browserRouterObj} />
    </div>
  );
}

export default App;
