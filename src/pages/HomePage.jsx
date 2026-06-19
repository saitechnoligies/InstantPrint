import React from "react";

// Section Component Imports
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import Features from "../components/Features";
import DashboardShowcase from "../components/Dashboard";
import Printers from "../components/Printers";
import Pricing from "../components/Pricing";
import Testimonials from "../components/Testimonials";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    // Exact Lovable Background Style: Deep rich warm tones with an ambient overlay glow
    <div className="relative min-h-screen bg-[#0f0e0c] text-[#e8e6e3] selection:bg-[#c9a66b]/30 overflow-x-hidden pb-12">
      
      {/* Premium Ambient Light Glow Layer */}
      <div className="absolute top-0 inset-x-0 h-[1000px] bg-[radial-gradient(circle_at_top,_rgba(40,35,28,0.6)_0%,_rgba(15,14,12,0.9)_50%,_rgba(15,14,12,1)_100%)] pointer-events-none z-0" />

      <div className="relative z-10">
        {/* 1. HERO SECTION (Ensure your Hero has extra padding top, e.g., pt-28 or pt-32, to clear the floating nav) */}
        <Hero />

        {/* 2. ADDITIONAL CONTENT MARKETING LAYERS */}
        <main>
          <DashboardShowcase />
          <HowItWorks />
          <Features />
          <Printers />
          <Pricing />
          <Testimonials />
          <Contact />
        </main>

        {/* 3. GLOBAL FOOTER COMPONENTS */}
        {/* <Footer /> */}
      </div>
    </div>
  );
}