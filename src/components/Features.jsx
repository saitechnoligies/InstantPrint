import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck, Zap, CloudUpload, QrCode, FileText, Network, Activity, Send,
} from "lucide-react";
import { SectionHeader } from "./HowItWorks"; // Ensure this path is correct

const features = [
  { icon: ShieldCheck, title: "OTP Security", desc: "End-to-end encrypted with single-use codes." },
  { icon: Zap, title: "Fast Printing", desc: "First page out in under 8 seconds." },
  { icon: CloudUpload, title: "Cloud Upload", desc: "Resumable uploads up to 500MB." },
  { icon: QrCode, title: "QR Verification", desc: "Scan-to-release as a second factor." },
  { icon: FileText, title: "All Formats", desc: "PDF, DOCX, PPTX, JPG, PNG, HEIC." },
  { icon: Network, title: "Printer Network", desc: "240+ kiosks across the city." },
  { icon: Activity, title: "Live Status", desc: "Real-time queue and paper levels." },
  { icon: Send, title: "Instant Delivery", desc: "Push prints from desktop or mobile." },
];

export default function Features() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader
          eyebrow="The Craft"
          title={
            <>
              Engineered for <br className="sm:hidden"/>
              <span className="italic bg-gradient-to-r from-[#c9a66b] to-[#e8d099] bg-clip-text text-transparent">
                discerning workflows.
              </span>
            </>
          }
          subtitle="Eight pillars of the PrintNow experience. Each one studied, each one quiet."
        />

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: (i % 4) * 0.06, duration: 0.5 }}
              className="group relative rounded-2xl bg-[#1e1c1a]/60 backdrop-blur-md border border-white/5 p-6 hover:bg-[#1e1c1a] hover:border-[#c9a66b]/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-[#c9a66b]/10 border border-[#c9a66b]/25 grid place-items-center mb-5 group-hover:bg-[#c9a66b]/20 transition-colors">
                <f.icon className="w-5 h-5 text-[#c9a66b]" />
              </div>
              <h3 className="text-base font-semibold tracking-tight text-white">
                {f.title}
              </h3>
              <p className="mt-1.5 text-sm text-[#a3a098] leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}