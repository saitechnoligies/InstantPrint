import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { SectionHeader } from "./HowItWorks"; // Ensure this path is correct

const plans = [
  {
    name: "Student",
    price: "9",
    desc: "For coursework, theses and late-night study sessions.",
    features: ["100 pages / month", "Standard B&W printing", "OTP verification", "Single device"],
  },
  {
    name: "Professional",
    price: "29",
    desc: "For consultants, founders and modern offices.",
    features: ["500 pages / month", "Color & duplex included", "Priority queue access", "All paper sizes", "Receipt archiving"],
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "For teams, agencies and printing at scale.",
    features: ["Unlimited pages", "Dedicated kiosks", "SSO & audit logs", "SLA & support", "Account manager"],
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader
          eyebrow="The Tiers"
          title={
            <>
              Plans cut to <br className="sm:hidden" />
              <span className="italic bg-gradient-to-r from-[#c9a66b] to-[#e8d099] bg-clip-text text-transparent">
                measure.
              </span>
            </>
          }
          subtitle="Pay for what you print. Upgrade only when the volume calls for it."
        />

        <div className="mt-16 grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-3xl p-8 flex flex-col justify-between shadow-2xl transition-all duration-300 ${
                p.featured
                  ? "bg-[#1e1c1a]/90 backdrop-blur-xl border border-[#c9a66b]/50 shadow-[0_0_40px_rgba(201,166,107,0.15)] md:scale-[1.03] z-10"
                  : "bg-[#1e1c1a]/60 backdrop-blur-md border border-white/5 hover:border-white/10"
              }`}
            >
              {p.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.22em] bg-[#c9a66b] text-[#1C1C18] px-4 py-1 rounded-full font-bold shadow-md">
                  Recommended
                </span>
              )}

              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#c9a66b]">
                  {p.name}
                </div>
                
                <div className="mt-5 flex items-baseline gap-1">
                  {p.price === "Custom" ? (
                    <span className="font-serif text-5xl text-white font-medium">Custom</span>
                  ) : (
                    <>
                      <span className="font-serif text-5xl sm:text-6xl bg-gradient-to-r from-[#c9a66b] to-[#e8d099] bg-clip-text text-transparent font-bold">
                        ${p.price}
                      </span>
                      <span className="text-sm text-[#a3a098]">/mo</span>
                    </>
                  )}
                </div>
                
                <p className="mt-4 text-sm text-[#a3a098] min-h-[40px] leading-relaxed">
                  {p.desc}
                </p>

                <div className="my-6 h-px bg-white/10 w-full" />

                <ul className="space-y-3.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <span className="mt-0.5 w-4 h-4 rounded-full bg-[#c9a66b]/15 grid place-items-center shrink-0">
                        <Check className="w-2.5 h-2.5 text-[#c9a66b]" strokeWidth={3} />
                      </span>
                      <span className="text-gray-300">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                className={`mt-8 w-full rounded-full py-3.5 text-sm font-bold tracking-wide transition-all duration-300 ${
                  p.featured
                    ? "bg-[#c9a66b] text-[#1C1C18] shadow-[0_10px_30px_-10px_rgba(201,166,107,0.4)] hover:shadow-[0_15px_40px_-10px_rgba(201,166,107,0.6)] hover:-translate-y-0.5"
                    : "border border-white/15 text-white hover:border-[#c9a66b]/50 hover:text-[#c9a66b] hover:bg-[#c9a66b]/5"
                }`}
              >
                {p.price === "Custom" ? "Talk to sales" : "Choose plan"}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}