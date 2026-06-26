import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, Navigation, Printer, FileText } from "lucide-react";

export default function IntroLoader({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { icon: UploadCloud, label: "Upload Document" },
    { icon: Navigation, label: "Walk to Kiosk" },
    { icon: Printer, label: "Enter Code" },
    { icon: FileText, label: "Collect Print" }
  ];

  useEffect(() => {
    // 1. If they already saw it this session, skip instantly
    if (sessionStorage.getItem("hasSeenIntro") === "true") {
      setIsVisible(false);
      onComplete();
      return;
    }

    // 2. Advance the step every 900ms
    if (activeStep < steps.length) {
      const timer = setTimeout(() => {
        setActiveStep((prev) => prev + 1);
      }, 900);
      return () => clearTimeout(timer);
    } else {
      // 3. When steps are done, trigger the slide-up exit
      setIsVisible(false);
      sessionStorage.setItem("hasSeenIntro", "true");
      // Wait for the slide-up animation to finish before notifying App.jsx
      const exitTimer = setTimeout(onComplete, 800); 
      return () => clearTimeout(exitTimer);
    }
  }, [activeStep, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="intro-loader"
          initial={{ y: 0 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0C0B0A] overflow-hidden"
        >
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(200,162,77,0.15),transparent_60%)] blur-3xl pointer-events-none" />

          {/* Centered changing component */}
          <div className="relative z-10 h-40 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {activeStep < steps.length && (
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center gap-6"
                >
                  {/* Glowing Icon Box */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[#c9a66b]/20 border border-[#c9a66b]/50 flex items-center justify-center shadow-[0_0_40px_-10px_rgba(200,162,77,0.5)]">
                    {React.createElement(steps[activeStep].icon, { 
                      className: "w-10 h-10 sm:w-12 sm:h-12 text-[#c9a66b]" 
                    })}
                  </div>
                  
                  {/* Text Label */}
                  <h2 className="text-lg sm:text-xl font-medium tracking-[0.2em] uppercase text-white">
                    {steps[activeStep].label}
                  </h2>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}