import React from "react";
import { UploadCloud, Settings2, CreditCard, Printer, Check } from "lucide-react";

const steps = [
  { id: 1, label: "Upload", icon: UploadCloud, status: "draft" },
  { id: 2, label: "Layout", icon: Settings2, status: "draft" },
  { id: 3, label: "Payment", icon: CreditCard, status: "pending_payment" },
  { id: 4, label: "Collect", icon: Printer, status: "paid" },
];

export default function OrderTimeline({ currentStep }) {
  return (
    <div className="w-full max-w-3xl mx-auto mb-8 sm:mb-12">
      <div className="relative flex items-center justify-between">
        
        {/* Background Connecting Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-white/5 z-0" />

        {/* Active Connecting Line Fill */}
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-[linear-gradient(90deg,#c9a66b_0%,#e8d099_100%)] z-0 transition-all duration-500 ease-out" 
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {/* Timeline Nodes */}
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          const isUpcoming = currentStep < step.id;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              {/* Node Icon Circle */}
              <div 
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-500
                  ${isCompleted 
                    ? "bg-[#c9a66b] text-[#1C1C18] shadow-[0_0_15px_rgba(200,162,77,0.4)]" 
                    : isActive
                    ? "bg-[#1e1c1a] border-2 border-[#c9a66b] text-[#c9a66b] shadow-[0_0_20px_rgba(200,162,77,0.2)]"
                    : "bg-[#0f0e0c] border border-white/10 text-[#a3a098]"
                  }
                `}
              >
                {isCompleted ? (
                  <Check size={18} strokeWidth={3} />
                ) : (
                  <step.icon size={18} />
                )}
              </div>

              {/* Node Label */}
              <div className="absolute top-14 sm:top-16 text-center w-24 -ml-6">
                <p className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wider transition-colors duration-300
                  ${isActive ? "text-[#c9a66b]" : isCompleted ? "text-white" : "text-[#a3a098]/50"}
                `}>
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}