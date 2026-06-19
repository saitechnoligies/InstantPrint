import React from "react";
import { motion } from "framer-motion";
import { SectionHeader } from "./HowItWorks"; // Ensure this path is correct

const quotes = [
  {
    q: "PrintVault replaced our entire office print fleet. The OTP flow is foolproof, and the design feels like a private members' club.",
    name: "Amara Okafor",
    role: "Head of Operations, Lumen Capital",
  },
  {
    q: "I uploaded my thesis from a café and picked it up two streets later. It just works — and it looks beautiful while doing it.",
    name: "Mateus Lima",
    role: "PhD Candidate, Imperial",
  },
  {
    q: "The most considered piece of infrastructure software we've adopted this year. Our partners noticed within a week.",
    name: "Sofía Reyes",
    role: "Partner, Aerie & Co.",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader
          eyebrow="The Word"
          title={
            <>
              Trusted by people who care <br className="sm:hidden" />
              <span className="italic bg-gradient-to-r from-[#c9a66b] to-[#e8d099] bg-clip-text text-transparent">
                how things feel.
              </span>
            </>
          }
        />

        <div className="mt-16 grid md:grid-cols-3 gap-6 lg:gap-8">
          {quotes.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#1e1c1a]/60 backdrop-blur-md border border-white/5 rounded-3xl p-7 flex flex-col justify-between shadow-2xl hover:border-white/10 transition-all duration-300"
            >
              <div>
                {/* Large elegant quotation mark */}
                <span className="font-serif text-5xl bg-gradient-to-r from-[#c9a66b] to-[#e8d099] bg-clip-text text-transparent leading-none select-none">
                  "
                </span>
                <blockquote className="mt-2 text-[15px] leading-relaxed text-gray-300">
                  {t.q}
                </blockquote>
              </div>
              
              <figcaption className="mt-6 pt-5 border-t border-white/10 flex items-center gap-3">
                {/* Monogram Fallback Avatar */}
                <span className="w-9 h-9 rounded-full bg-[#c9a66b]/25 border border-[#c9a66b]/40 grid place-items-center font-serif text-sm font-semibold text-[#c9a66b] shrink-0 select-none">
                  {t.name[0]}
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-white truncate">{t.name}</div>
                  <div className="text-xs text-[#a3a098] truncate mt-0.5">{t.role}</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}