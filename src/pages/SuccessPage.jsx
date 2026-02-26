export default function SuccessPage({ orderData, onReset }) {
  const otp = String(Math.floor(1000 + Math.random() * 9000));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Outfit:wght@300;400;500;600&display=swap');

        .success-root {
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

        .success-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 600px 500px at 80% 20%, rgba(16,185,129,0.07) 0%, transparent 70%),
            radial-gradient(ellipse 500px 400px at 10% 80%, rgba(37,99,235,0.05) 0%, transparent 60%);
          pointer-events: none;
        }

        .deco-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(16,185,129,0.1);
          pointer-events: none;
        }

        .deco-dot-grid {
          position: absolute;
          width: 120px; height: 120px;
          background-image: radial-gradient(circle, rgba(16,185,129,0.15) 1.5px, transparent 1.5px);
          background-size: 16px 16px;
          pointer-events: none;
          top: 50px; left: 50px;
        }

        /* Card */
        .success-card {
          position: relative;
          z-index: 1;
          background: white;
          border-radius: 28px;
          padding: 2.5rem 2rem;
          width: 100%;
          max-width: 440px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.03), 0 20px 50px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
          animation: cardIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(28px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Step trail */
        .step-trail {
          display: flex;
          align-items: center;
          width: 100%;
          margin-bottom: 2rem;
          animation: cardIn 0.5s 0.05s cubic-bezier(0.22,1,0.36,1) both;
        }

        .step-t { display: flex; align-items: center; gap: 6px; }

        .step-t-num {
          width: 20px; height: 20px;
          border-radius: 50%;
          font-size: 0.6rem;
          font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .step-t-num.done { background: #10b981; color: white; }
        .step-t-num.active { background: #10b981; color: white; box-shadow: 0 0 0 3px rgba(16,185,129,0.2); }

        .step-t-label { font-size: 0.68rem; font-weight: 600; }
        .step-t-label.done { color: #10b981; }
        .step-t-label.active { color: #10b981; }

        .step-connector { flex: 1; height: 1px; background: #d1fae5; margin: 0 8px; }

        /* Success icon ring */
        .icon-area {
          margin-bottom: 1.25rem;
          animation: popIn 0.5s 0.2s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes popIn {
          from { opacity: 0; transform: scale(0.7); }
          to   { opacity: 1; transform: scale(1); }
        }

        .icon-outer {
          width: 80px; height: 80px;
          border-radius: 50%;
          background: #ecfdf5;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 0 8px rgba(16,185,129,0.08), 0 0 0 16px rgba(16,185,129,0.04);
          position: relative;
        }

        .icon-outer::after {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 1.5px solid rgba(16,185,129,0.25);
          animation: ripple 2s ease-out infinite;
        }

        @keyframes ripple {
          0%   { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }

        /* Headline */
        .success-headline {
          font-family: 'Playfair Display', serif;
          font-size: 1.8rem;
          color: #0f172a;
          margin: 0 0 4px;
          text-align: center;
          animation: cardIn 0.5s 0.25s cubic-bezier(0.22,1,0.36,1) both;
        }

        .success-sub {
          font-size: 0.88rem;
          color: #64748b;
          text-align: center;
          margin-bottom: 1.75rem;
          animation: cardIn 0.5s 0.3s cubic-bezier(0.22,1,0.36,1) both;
        }

        .divider {
          width: 100%;
          height: 1px;
          background: linear-gradient(to right, transparent, #e2e8f0, transparent);
          margin-bottom: 1.75rem;
        }

        /* OTP */
        .otp-section {
          width: 100%;
          margin-bottom: 1.75rem;
          animation: cardIn 0.5s 0.35s cubic-bezier(0.22,1,0.36,1) both;
        }

        .section-label {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #94a3b8;
          text-align: center;
          margin-bottom: 0.9rem;
        }

        .otp-tiles {
          display: flex;
          justify-content: center;
          gap: 10px;
        }

        .otp-tile {
          width: 64px; height: 76px;
          border-radius: 16px;
          background: #f8faff;
          border: 1.5px solid #bfdbfe;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Playfair Display', serif;
          font-size: 2.2rem;
          color: #2563eb;
          box-shadow: 0 2px 12px rgba(37,99,235,0.1), inset 0 1px 0 rgba(255,255,255,0.8);
          animation: tileIn 0.4s cubic-bezier(0.22,1,0.36,1) both;
        }

        .otp-tile:nth-child(1) { animation-delay: 0.4s; }
        .otp-tile:nth-child(2) { animation-delay: 0.48s; }
        .otp-tile:nth-child(3) { animation-delay: 0.56s; }
        .otp-tile:nth-child(4) { animation-delay: 0.64s; }

        @keyframes tileIn {
          from { opacity: 0; transform: translateY(14px) scale(0.9); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .otp-note {
          text-align: center;
          font-size: 0.75rem;
          color: #94a3b8;
          margin-top: 0.65rem;
        }

        /* Summary */
        .summary {
          width: 100%;
          background: #f8fafc;
          border-radius: 16px;
          padding: 1.1rem 1.25rem;
          margin-bottom: 1rem;
          display: flex;
          flex-direction: column;
          gap: 8px;
          animation: cardIn 0.5s 0.5s cubic-bezier(0.22,1,0.36,1) both;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.82rem;
        }

        .summary-label { color: #94a3b8; font-weight: 400; }

        .summary-val {
          color: #1e293b;
          font-weight: 600;
          max-width: 55%;
          text-align: right;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .summary-val.total { color: #2563eb; font-family: 'Playfair Display', serif; font-size: 1rem; }

        .summary-divider { height: 1px; background: #e2e8f0; }

        /* Instruction banner */
        .instruction {
          width: 100%;
          background: linear-gradient(135deg, #ecfdf5, #d1fae5);
          border: 1px solid #a7f3d0;
          border-radius: 14px;
          padding: 1rem 1.25rem;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 1.25rem;
          animation: cardIn 0.5s 0.55s cubic-bezier(0.22,1,0.36,1) both;
        }

        .instruction-icon {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: white;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
          font-size: 1rem;
        }

        .instruction-text {
          font-size: 0.82rem;
          font-weight: 500;
          color: #065f46;
          line-height: 1.45;
        }

        /* CTA */
        .reset-btn {
          width: 100%;
          padding: 0.9rem;
          border-radius: 14px;
          border: 1.5px solid #e2e8f0;
          background: white;
          font-family: 'Outfit', sans-serif;
          font-size: 0.88rem;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          animation: cardIn 0.5s 0.6s cubic-bezier(0.22,1,0.36,1) both;
        }

        .reset-btn:hover {
          border-color: #93c5fd;
          color: #2563eb;
          background: #f0f7ff;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(37,99,235,0.08);
        }

        .reset-btn:active { transform: translateY(0); }
      `}</style>

      <div className="success-root">
        <div className="deco-ring" style={{ width: 380, height: 380, top: -120, right: -100 }} />
        <div className="deco-ring" style={{ width: 200, height: 200, bottom: 60, left: 60 }} />
        <div className="deco-dot-grid" />

        <div className="success-card">
          {/* Step trail — all done */}
          <div className="step-trail">
            {[
              { label: "Upload", state: "done" },
              { label: "Options", state: "done" },
              { label: "Pay", state: "done" },
              { label: "Collect", state: "active" },
            ].map(({ label, state }, i, arr) => (
              <div key={label} style={{ display: "flex", alignItems: "center", flex: i < arr.length - 1 ? 1 : undefined }}>
                <div className="step-t">
                  <div className={`step-t-num ${state}`}>
                    <svg width="9" height="9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <span className={`step-t-label ${state}`}>{label}</span>
                </div>
                {i < arr.length - 1 && <div className="step-connector" />}
              </div>
            ))}
          </div>

          {/* Icon */}
          <div className="icon-area">
            <div className="icon-outer">
              <svg width="34" height="34" fill="none" viewBox="0 0 24 24" stroke="#10b981" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
          </div>

          {/* Headline */}
          <h2 className="success-headline">You're all set!</h2>
          <p className="success-sub">Payment confirmed. Head to the print shop to collect.</p>

          <div className="divider" />

          {/* OTP */}
          <div className="otp-section">
            <p className="section-label">Collection OTP</p>
            <div className="otp-tiles">
              {otp.split("").map((digit, i) => (
                <div className="otp-tile" key={i}>{digit}</div>
              ))}
            </div>
            <p className="otp-note">Show this code at the counter — valid for 24 hours</p>
          </div>

          {/* Summary */}
          <div className="summary">
            {[
              ["File", orderData.fileData.file.name],
              ["Print type", orderData.printType === "bw" ? "Black & White" : "Color"],
              ["Copies", `${orderData.copies} ${orderData.copies === 1 ? "copy" : "copies"}`],
            ].map(([label, value]) => (
              <div className="summary-row" key={label}>
                <span className="summary-label">{label}</span>
                <span className="summary-val">{value}</span>
              </div>
            ))}
            <div className="summary-divider" />
            <div className="summary-row">
              <span className="summary-label">Total paid</span>
              <span className="summary-val total">₹{orderData.total}</span>
            </div>
          </div>

          {/* Instruction */}
          <div className="instruction">
            <div className="instruction-icon">🖨️</div>
            <p className="instruction-text">
              Visit any partner print shop and share your OTP at the counter to collect your documents.
            </p>
          </div>

          {/* Reset */}
          <button className="reset-btn" onClick={onReset}>
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Print Another Document
          </button>
        </div>
      </div>
    </>
  );
}
