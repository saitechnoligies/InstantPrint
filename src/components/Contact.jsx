import React from "react";
import { ArrowUpRight } from "lucide-react";

function Input({ label, ...props }) {
  return (
    <label className="block">
      <div className="text-[11px] uppercase tracking-wider text-[#a3a098] mb-2">{label}</div>
      <input
        {...props}
        className="w-full bg-[#0f0e0c]/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#a3a098]/40 focus:outline-none focus:border-[#c9a66b]/50 focus:bg-[#0f0e0c]/80 transition-colors"
      />
    </label>
  );
}

export default function Contact() {
  return (
    <section id="contact" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[32px] bg-[#1e1c1a]/80 backdrop-blur-xl border border-white/10 p-8 sm:p-16 shadow-2xl">
          {/* Ambient Glow */}
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(201,166,107,0.15),transparent_70%)] pointer-events-none" />
          
          <div className="relative grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
            <div>
              <div className="text-[11px] uppercase tracking-[0.22em] text-[#c9a66b]">
                <span className="inline-block w-6 h-px bg-[#c9a66b]/60 align-middle mr-2" />
                Get in touch
              </div>
              <h2 className="mt-5 font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-white">
                Print your first <br />
                <span className="italic bg-gradient-to-r from-[#c9a66b] to-[#e8d099] bg-clip-text text-transparent">
                  document tonight.
                </span>
              </h2>
              <p className="mt-5 text-sm sm:text-base text-[#a3a098] max-w-md leading-relaxed">
                Create a free vault, upload anything, and pick up your prints from any PrintNow kiosk in the network.
              </p>
            </div>

            <form className="bg-[#1e1c1a]/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
              <Input label="Name" placeholder="Ada Lovelace" />
              <Input label="Email" placeholder="ada@studio.com" type="email" />
              <Input label="Organisation" placeholder="Optional" />
              
              <button className="w-full mt-2 rounded-full bg-[#c9a66b] text-[#1C1C18] font-bold tracking-wide py-4 inline-flex items-center justify-center gap-2 shadow-[0_10px_30px_-10px_rgba(201,166,107,0.4)] hover:shadow-[0_15px_40px_-10px_rgba(201,166,107,0.6)] hover:scale-[1.01] transition-all duration-300 cursor-pointer">
                Request Access <ArrowUpRight className="w-4 h-4" />
              </button>
              
              <p className="text-[11px] text-center text-[#a3a098]">We reply within one business day.</p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}