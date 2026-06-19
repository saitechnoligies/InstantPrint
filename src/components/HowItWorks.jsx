import React from "react";
import { motion } from "framer-motion";
import { UploadCloud, ShieldCheck, Printer } from "lucide-react";

const steps = [
  {
    n: "01",
    icon: UploadCloud,
    title: "Upload Document",
    desc: "Drag and drop PDFs, DOCX or images into your vault. Files are encrypted at rest.",
  },
  {
    n: "02",
    icon: ShieldCheck,
    title: "Receive OTP",
    desc: "A 6-digit verification code is generated instantly, valid for 30 minutes.",
  },
  {
    n: "03",
    icon: Printer,
    title: "Collect Print",
    desc: "Enter your OTP at any kiosk to release your prints — paper-perfect, every time.",
  },
];

// Reusable Section Header for your landing page
export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
}) {
  const isCenter = align === "center";
  return (
    <div className={isCenter ? "text-center max-w-2xl mx-auto" : "max-w-2xl"}>
      <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[#c9a66b]">
        <span className="w-6 h-px bg-[#c9a66b]/60" /> {eyebrow}
      </div>
      <h2 className="mt-5 font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-white">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-5 text-[#a3a098] leading-relaxed text-sm sm:text-base">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader
          eyebrow="The Ritual"
          title={
            <>
              Three steps. <br className="sm:hidden" />
              <span className="italic bg-gradient-to-r from-[#c9a66b] to-[#e8d099] bg-clip-text text-transparent">
                Zero friction.
              </span>
            </>
          }
          subtitle="Designed for students, offices and enterprises who value time, privacy and presentation."
        />

        <div className="mt-16 grid md:grid-cols-3 gap-5">
          {steps.map((s, i) => (
            <motion.article
              key={s.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="group relative overflow-hidden rounded-3xl bg-[#1e1c1a]/60 backdrop-blur-md border border-white/5 p-8 hover:-translate-y-1 transition-all duration-500 hover:border-[#c9a66b]/35 shadow-lg"
            >
              {/* Subtle gold hover glow */}
              <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-[radial-gradient(circle,rgba(201,166,107,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="flex items-center justify-between relative z-10">
                <span className="font-serif text-5xl bg-gradient-to-r from-[#c9a66b] to-[#e8d099] bg-clip-text text-transparent">
                  {s.n}
                </span>
                <div className="w-12 h-12 rounded-xl border border-white/10 bg-[#1e1c1a] grid place-items-center">
                  <s.icon className="w-5 h-5 text-[#c9a66b]" />
                </div>
              </div>
              
              <h3 className="mt-8 text-2xl font-serif text-white relative z-10">
                {s.title}
              </h3>
              <p className="mt-3 text-sm text-[#a3a098] leading-relaxed relative z-10">
                {s.desc}
              </p>
              
              <div className="mt-8 h-px bg-white/10 w-full relative z-10" />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}