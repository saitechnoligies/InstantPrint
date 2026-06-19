import React from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Printer as PrinterIcon } from "lucide-react";
import { SectionHeader } from "./HowItWorks"; // Ensure this path is correct

const printers = [
  { name: "Marina Bay Atrium", dist: "0.4 km", status: "open", price: "3¢", queue: "3 in queue" },
  { name: "Orchard · Ion Mezz", dist: "1.2 km", status: "open", price: "4¢", queue: "Free" },
  { name: "Raffles Place Library", dist: "2.1 km", status: "busy", price: "3¢", queue: "8 in queue" },
  { name: "Tanjong Pagar Hub", dist: "2.8 km", status: "open", price: "5¢", queue: "1 in queue" },
];

function MapBackground() {
  return (
    <div className="absolute inset-0 bg-[#0f0e0c]">
      <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#c9a66b" strokeOpacity="0.12" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      {/* abstract roads */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M0 35 Q 40 30 60 50 T 100 55" stroke="#c9a66b" strokeOpacity="0.25" strokeWidth="0.4" fill="none" />
        <path d="M20 0 Q 30 40 50 60 T 70 100" stroke="#c9a66b" strokeOpacity="0.18" strokeWidth="0.4" fill="none" />
        <path d="M0 80 Q 50 70 100 80" stroke="#c9a66b" strokeOpacity="0.18" strokeWidth="0.4" fill="none" />
      </svg>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_45%,rgba(201,166,107,0.15),transparent_50%)]" />
    </div>
  );
}

function Pin({ x, y, main }) {
  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: x, top: y }}>
      {main && (
        <span className="absolute inset-0 w-10 h-10 -m-3 rounded-full bg-[#c9a66b]/30 animate-ping" />
      )}
      <div className={`relative w-4 h-4 rounded-full ${main ? "bg-[#c9a66b] ring-4 ring-[#c9a66b]/30" : "bg-[#c9a66b]/40"}`} />
    </div>
  );
}

export default function Printers() {
  return (
    <section id="printers" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader
          align="left"
          eyebrow="The Network"
          title={
            <>
              A quiet city of <br className="sm:hidden" />
              <span className="italic bg-gradient-to-r from-[#c9a66b] to-[#e8d099] bg-clip-text text-transparent">
                kiosks
              </span>, always within reach.
            </>
          }
        />

        <div className="mt-14 grid lg:grid-cols-[1.3fr_1fr] gap-6 lg:gap-8">
          
          {/* --- MAP VISUAL --- */}
          <div className="relative rounded-3xl overflow-hidden bg-[#1e1c1a]/80 backdrop-blur-xl border border-white/10 shadow-2xl aspect-[4/3] lg:aspect-auto min-h-[420px]">
            <MapBackground />
            
            {/* Map Pins */}
            {[
              { x: "28%", y: "40%", main: true },
              { x: "55%", y: "30%" },
              { x: "70%", y: "60%" },
              { x: "40%", y: "70%" },
              { x: "82%", y: "45%" },
            ].map((p, i) => (
              <Pin key={i} x={p.x} y={p.y} main={p.main} />
            ))}

            {/* Nearest Location Card Overlay */}
            <div className="absolute bottom-5 left-5 right-5 sm:left-auto sm:w-80 bg-[#1e1c1a]/90 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex items-center justify-between shadow-lg">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-[#c9a66b]">Nearest</div>
                <div className="text-sm font-medium text-white mt-1">Marina Bay Atrium</div>
              </div>
              <span className="text-xs text-[#a3a098]">0.4 km · 5 min walk</span>
            </div>
          </div>

          {/* --- LOCATIONS LIST --- */}
          <div className="space-y-3">
            {printers.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-[#1e1c1a]/60 backdrop-blur-md border border-white/5 rounded-2xl p-5 flex items-center gap-4 hover:bg-[#1e1c1a] hover:border-[#c9a66b]/30 transition-all cursor-pointer group shadow-md"
              >
                <div className="w-12 h-12 rounded-xl bg-[#c9a66b]/10 border border-[#c9a66b]/25 flex items-center justify-center shrink-0 group-hover:bg-[#c9a66b]/20 transition-colors">
                  <PrinterIcon className="w-5 h-5 text-[#c9a66b]" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="font-medium text-white truncate text-sm sm:text-base">{p.name}</div>
                    <span 
                      className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full ${
                        p.status === "open"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-1.5 text-xs text-[#a3a098]">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" />{p.dist}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />{p.queue}
                    </span>
                  </div>
                </div>
                
                <div className="text-right shrink-0">
                  <div className="font-serif text-xl sm:text-2xl bg-gradient-to-r from-[#c9a66b] to-[#e8d099] bg-clip-text text-transparent">
                    {p.price}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-[#a3a098] mt-0.5">
                    per page
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
        </div>
      </div>
    </section>
  );
}