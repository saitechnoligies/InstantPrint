import React from "react";
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
          element: <OptionsPage />,
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
        {
          path:"/orders",
          element: <OrdersPage />
        },
        {
          path: "/admin",
          element: <AdminPage />,
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
