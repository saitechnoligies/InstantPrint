import React from "react";
import { Printer } from "lucide-react";

function FooterCol({ title, links }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#c9a66b] mb-4">
        {title}
      </div>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l}>
            <a 
              href="#" 
              className="text-sm text-[#a3a098] hover:text-white transition-colors"
            >
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 pt-16 pb-10 bg-[#0f0e0c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10">
          {/* Logo Brand Segment */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 group cursor-pointer select-none">
              <span className="grid place-items-center w-8 h-8 rounded-lg bg-[#c9a66b] transition-transform group-hover:scale-105">
                <Printer className="w-4 h-4 text-[#1C1C18]" strokeWidth={2.5} />
              </span>
              <span className="font-serif text-lg text-white">
                Print<span className="bg-gradient-to-r from-[#c9a66b] to-[#e8d099] bg-clip-text text-transparent">Now</span>
              </span>
            </div>
            <p className="mt-5 text-sm text-[#a3a098] max-w-xs leading-relaxed">
              Secure cloud printing for a quieter, more considered way of working.
            </p>
          </div>

          <FooterCol title="Product" links={["How it works", "Printers", "Pricing", "Security"]} />
          <FooterCol title="Company" links={["About", "Press", "Careers", "Contact"]} />
          <FooterCol title="Legal" links={["Privacy", "Terms", "Cookies", "Status"]} />
        </div>

        {/* Bottom Metadata Bar */}
        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#a3a098]">
          <span>© {new Date().getFullYear()} PrintNow Atelier. All rights reserved.</span>
          <span className="font-serif italic text-[#c9a66b]/70">Printed with intention.</span>
        </div>
      </div>
    </footer>
  );
}