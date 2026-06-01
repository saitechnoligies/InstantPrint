import React from "react";
import { Outlet } from "react-router-dom";
import Nav from "./Nav";

function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Nav />

      <main className="flex-1 pt-16 ">
        <Outlet />
      </main>
    </div>
  );
}
export default RootLayout;
