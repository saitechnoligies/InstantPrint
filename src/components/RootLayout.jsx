import React from "react";
import { Outlet } from "react-router-dom";
import Nav from "./Nav";
import Footer from "./Footer";
function RootLayout() {
  return (
    // Set the fallback background to the dark theme baseline
    <div className="min-h-screen flex flex-col bg-[#16160F]">
      <Nav />
      {/* Content wrapper */}
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />

    </div>
  );
}
export default RootLayout;