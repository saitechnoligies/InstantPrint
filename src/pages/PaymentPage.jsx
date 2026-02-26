import { useEffect, useState } from "react";

const STEPS = [
  { label: "Verifying order details", duration: 700 },
  { label: "Contacting payment gateway", duration: 800 },
  { label: "Authorising transaction", duration: 600 },
  { label: "Confirming with print shop", duration: 400 },
];

export default function PaymentPage({ onSuccess }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [doneSteps, setDoneSteps] = useState([]);

  useEffect(() => {
    let stepIdx = 0;
    let elapsed = 0;

    const timers = STEPS.map((step, i) => {
      const t = setTimeout(() => {
        setCurrentStep(i + 1);
        setDoneSteps(prev => [...prev, i]);
      }, elapsed + step.duration);
      elapsed += step.duration;
      return t;
    });

    // Trigger success after all steps
    const done = setTimeout(() => onSuccess(), elapsed + 300);

    return () => { timers.forEach(clearTimeout); clearTimeout(done); };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Outfit:wght@300;400;500;600&display=swap');

        .pay-root {
          min-height: 100vh;
          background: #f0ede8;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1.5rem;
          font-family: 'Outfit', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .pay-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 600px 500px at 70% 20%, rgba(37,99,235,0.07) 0%, transparent 70%),
            radial-gradient(ellipse 500px 400px at 15% 80%, rgba(16,185,129,0.05) 0%, transparent 60%);
          pointer-events: none;
        }

        .deco-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(37,99,235,0.08);
          pointer-events: none;
        }

        .pay-card {
          position: relative;
          z-index: 1;
          background: white;
          border-radius: 28px;
          padding: 2.75rem 2.25rem;
          width: 100%;
          max-width: 420px;
          box-shadow:
            0 4px 6px rgba(0,0,0,0.03),
            0 20px 50px rgba(0,0,0,0.08),
            0 0 0 1px rgba(0,0,0,0.04);
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: cardIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(24px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Spinner */
        .spinner-wrap {
          position: relative;
          width: 80px;
          height: 80px;
          margin-bottom: 1.75rem;
        }

        .spinner-bg {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: #eff6ff;
        }

        .spinner-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 3px solid transparent;
          border-top-color: #2563eb;
          border-right-color: #93c5fd;
          animation: spinRing 0.9s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .spinner-icon {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @keyframes spinRing {
          to { transform: rotate(360deg); }
        }

        /* Pulse glow behind spinner */
        .spinner-glow {
          position: absolute;
          inset: -8px;
          border-radius: 50%;
          background: rgba(37,99,235,0.08);
          animation: glowPulse 1.8s ease-in-out infinite;
        }

        @keyframes glowPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%       { transform: scale(1.15); opacity: 0.5; }
        }

        /* Text */
        .pay-headline {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          color: #0f172a;
          margin: 0 0 6px;
          text-align: center;
        }

        .pay-sub {
          font-size: 0.85rem;
          color: #94a3b8;
          text-align: center;
          margin-bottom: 2rem;
          line-height: 1.5;
        }

        /* Divider */
        .pay-divider {
          width: 100%;
          height: 1px;
          background: linear-gradient(to right, transparent, #e2e8f0, transparent);
          margin-bottom: 1.5rem;
        }

        /* Step list */
        .step-list {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .step-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0.65rem 0;
          position: relative;
        }

        /* Vertical connector */
        .step-item:not(:last-child)::after {
          content: '';
          position: absolute;
          left: 11px;
          top: calc(0.65rem + 23px);
          width: 1.5px;
          height: calc(100% - 12px);
          background: #e2e8f0;
        }

        .step-item:not(:last-child).done::after {
          background: #10b981;
          transition: background 0.3s;
        }

        .step-dot {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          position: relative;
          z-index: 1;
        }

        .step-dot.pending {
          background: #f1f5f9;
          border: 1.5px solid #e2e8f0;
        }

        .step-dot.active {
          background: #eff6ff;
          border: 1.5px solid #93c5fd;
          box-shadow: 0 0 0 4px rgba(37,99,235,0.08);
        }

        .step-dot.done {
          background: #10b981;
          border: 1.5px solid #10b981;
        }

        .step-dot-inner {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          transition: all 0.3s;
        }

        .step-dot.pending .step-dot-inner { background: #cbd5e1; }
        .step-dot.active  .step-dot-inner {
          background: #2563eb;
          animation: dotPulse 0.8s ease-in-out infinite alternate;
        }

        @keyframes dotPulse {
          from { transform: scale(0.7); opacity: 0.7; }
          to   { transform: scale(1.2); opacity: 1; }
        }

        .step-label {
          font-size: 0.85rem;
          font-weight: 500;
          transition: color 0.3s;
        }

        .step-label.pending { color: #94a3b8; }
        .step-label.active  { color: #1e293b; font-weight: 600; }
        .step-label.done    { color: #64748b; }

        /* Security note */
        .security-note {
          margin-top: 1.75rem;
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 0.75rem;
          color: #94a3b8;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 100px;
          padding: 6px 14px;
        }

        /* Shimmer on the card edge while processing */
        .pay-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 28px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(37,99,235,0.04) 50%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: cardShimmer 2.5s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes cardShimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }

        /* Step check icon pop */
        @keyframes checkPop {
          0%   { transform: scale(0.5); opacity: 0; }
          70%  { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }

        .check-pop { animation: checkPop 0.35s cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>

      <div className="pay-root">
        <div className="deco-ring" style={{ width: 400, height: 400, top: -130, right: -120 }} />
        <div className="deco-ring" style={{ width: 220, height: 220, bottom: 50, left: 40 }} />

        <div className="pay-card">
          {/* Spinner */}
          <div className="spinner-wrap">
            <div className="spinner-glow" />
            <div className="spinner-bg" />
            <div className="spinner-ring" />
            <div className="spinner-icon">
              <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="#2563eb" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
              </svg>
            </div>
          </div>

          {/* Headline */}
          <h2 className="pay-headline">Processing Payment</h2>
          <p className="pay-sub">
            Please don't close or refresh this page.<br />This usually takes just a moment.
          </p>

          <div className="pay-divider" />

          {/* Step list */}
          <div className="step-list">
            {STEPS.map((step, i) => {
              const isDone = doneSteps.includes(i);
              const isActive = currentStep === i && !isDone;
              const state = isDone ? "done" : isActive ? "active" : "pending";

              return (
                <div key={i} className={`step-item ${state}`}>
                  <div className={`step-dot ${state}`}>
                    {isDone ? (
                      <svg className="check-pop" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    ) : (
                      <div className="step-dot-inner" />
                    )}
                  </div>
                  <span className={`step-label ${state}`}>{step.label}</span>
                </div>
              );
            })}
          </div>

          {/* Security note */}
          <div className="security-note">
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            256-bit SSL encrypted · Powered by Stripe
          </div>
        </div>
      </div>
    </>
  );
}
