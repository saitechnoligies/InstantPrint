import React, { useEffect, useState } from "react";
import { Menu, X, Printer } from "lucide-react";
import { UserButton, useUser, useClerk } from "@clerk/react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Nav() {
  // 1. ALL HOOKS GO FIRST
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  
  const { isSignedIn, user } = useUser();
  const { openSignIn } = useClerk();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // 2. DATA CALCULATION
  const isAdmin = user?.primaryEmailAddress?.emailAddress === "pittalacharanchandu@gmail.com";

  const links = [
    { href: "/", label: "Home" },
    { href: "/#how-it-works", label: "How It Works" },
    ...(isSignedIn ? [{ href: "/orders", label: "Orders" }] : []),
    ...(isAdmin ? [{ href: "/admin", label: "Admin Dashboard" }] : []),
    { href: "/#contact", label: "Contact" },
  ];

  const handleNavigation = (href) => {
    if (href.startsWith("/#")) {
      const targetId = href.split("#")[1];
      
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          const element = document.getElementById(targetId);
          if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 150);
      } else {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    } else {
      navigate(href);
    }
    setOpen(false);
  };

  // 🔥 3. EARLY RETURN GOES HERE (Safely after all hooks)
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  // 4. RENDER UI
  return (
    <header className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 pt-4">
      <nav
        className={`w-full max-w-7xl rounded-full border border-white/10 bg-[#1e1c1a]/80 backdrop-blur-xl transition-all duration-500 ${
          scrolled
            ? "py-2.5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.65)]"
            : "py-3.5"
        }`}
      >
        <div className="flex items-center justify-between px-4 sm:px-6">
          
          {/* ================= LOGO ================= */}
          <div
            onClick={() => handleNavigation("/")}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="grid place-items-center w-9 h-9 rounded-xl bg-[#c9a66b] transition-transform duration-300 group-hover:scale-105">
              <Printer className="w-5 h-5 text-[#1C1C18]" strokeWidth={2.5} />
            </div>
            <span className="font-serif text-[22px] text-white tracking-tight">
              Print<span className="bg-gradient-to-r from-[#c9a66b] to-[#e8d099] bg-clip-text text-transparent">Now</span>
            </span>
          </div>

          {/* ================= DESKTOP LINKS ================= */}
          <ul className="hidden lg:flex items-center gap-6">
            {links.map((link) => {
              const isActive = link.href.startsWith("/#") 
                ? location.hash === link.href.substring(1)
                : location.pathname === link.href && !location.hash;

              const isAdminLink = link.label === "Admin Dashboard";

              return (
                <li key={link.href}>
                  <button
                    onClick={() => handleNavigation(link.href)}
                    className={`text-[14px] font-medium transition-all duration-300 ${
                      isActive 
                        ? (isAdminLink ? "text-[#c9a66b]" : "text-white") 
                        : (isAdminLink ? "text-[#c9a66b]/70 hover:text-[#c9a66b]" : "text-[#a3a098] hover:text-white")
                    }`}
                  >
                    {link.label}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* ================= RIGHT ACTIONS ================= */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {!isSignedIn ? (
              <button 
                onClick={() => openSignIn()}
                className="hidden sm:block text-[13px] font-semibold tracking-wide text-white bg-white/10 border border-white/20 px-5 py-2 rounded-full hover:bg-white/20 hover:border-white/30 transition-all cursor-pointer"
              >
                Login
              </button>
            ) : (
              <div className="hidden sm:block rounded-full border border-white/20 p-1 cursor-pointer hover:border-[#c9a66b]/50 transition-colors shadow-inner">
                <UserButton appearance={{ elements: { userButtonAvatarBox: "w-7 h-7" } }} />
              </div>
            )}

            <button
              onClick={() => handleNavigation("/upload")}
              className="hidden sm:inline-flex items-center gap-2 rounded-full border border-[#c9a66b]/40 bg-transparent px-6 py-2 text-[14px] font-medium text-white hover:bg-[#c9a66b]/10 transition-all duration-300 cursor-pointer"
            >
              Print Now
              <span className="text-[#c9a66b]">→</span>
            </button>

            <button
              onClick={() => setOpen((prev) => !prev)}
              className="lg:hidden grid place-items-center w-9 h-9 rounded-full border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* ================= MOBILE MENU ================= */}
        {open && (
          <div className="lg:hidden mt-4 border-t border-white/10 px-4 pt-4 pb-3 animate-in slide-in-from-top-2 fade-in duration-200">
            <ul className="flex flex-col gap-2">
              {links.map((link) => {
                const isActive = link.href.startsWith("/#") 
                  ? location.hash === link.href.substring(1) 
                  : location.pathname === link.href;
                  
                const isAdminLink = link.label === "Admin Dashboard";

                return (
                  <li key={link.href}>
                    <button
                      onClick={() => handleNavigation(link.href)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? (isAdminLink ? "bg-[#c9a66b]/10 text-[#c9a66b]" : "bg-white/10 text-white")
                          : (isAdminLink ? "text-[#c9a66b]/70 hover:text-[#c9a66b] hover:bg-white/5" : "text-[#a3a098] hover:text-white hover:bg-white/5")
                      }`}
                    >
                      {link.label}
                    </button>
                  </li>
                );
              })}

              {!isSignedIn ? (
                <li className="pt-2 grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => {
                      setOpen(false);
                      openSignIn();
                    }}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-medium text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => handleNavigation("/upload")}
                    className="w-full rounded-xl border border-[#c9a66b]/30 bg-[#c9a66b]/10 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-[#c9a66b]/20 transition-colors cursor-pointer"
                  >
                    Print Now →
                  </button>
                </li>
              ) : (
                <li className="pt-2">
                  <button
                    onClick={() => handleNavigation("/upload")}
                    className="w-full rounded-xl border border-[#c9a66b]/30 bg-[#c9a66b]/10 px-4 py-3 text-left text-sm font-semibold text-white flex justify-between items-center hover:bg-[#c9a66b]/20 transition-colors cursor-pointer"
                  >
                    Start a New Print
                    <span className="text-[#c9a66b]">→</span>
                  </button>
                </li>
              )}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}