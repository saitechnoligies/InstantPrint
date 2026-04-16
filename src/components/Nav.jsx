export default function Nav({ onNav }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Outfit:wght@300;400;500;600&display=swap');

        .nav-root {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          height: 62px;
          background: rgba(240, 237, 232, 0.82);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(0,0,0,0.06);
          font-family: 'Outfit', sans-serif;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          cursor: default;
          user-select: none;
        }

        .nav-logo-icon {
          width: 32px; height: 32px;
          border-radius: 10px;
          background: linear-gradient(135deg, #1d4ed8, #3b82f6);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 8px rgba(37,99,235,0.3);
        }

        .nav-logo-wordmark {
          font-family: 'Playfair Display', serif;
          font-size: 1.15rem;
          letter-spacing: -0.01em;
          color: #0f172a;
          line-height: 1;
        }

        .nav-logo-wordmark span {
          color: #2563eb;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .nav-link {
          background: none;
          border: none;
          padding: 0.4rem 0.85rem;
          border-radius: 100px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.83rem;
          font-weight: 500;
          color: #64748b;
          cursor: pointer;
          transition: color 0.15s, background 0.15s;
          letter-spacing: 0.01em;
        }

        .nav-link:hover {
          color: #0f172a;
          background: rgba(0,0,0,0.05);
        }

        .nav-cta {
          margin-left: 0.5rem;
          background: none;
          border: 1.5px solid rgba(37,99,235,0.3);
          padding: 0.38rem 1rem;
          border-radius: 100px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.83rem;
          font-weight: 600;
          color: #2563eb;
          cursor: pointer;
          transition: all 0.18s;
        }

        .nav-cta:hover {
          background: #2563eb;
          border-color: #2563eb;
          color: white;
          box-shadow: 0 3px 10px rgba(37,99,235,0.25);
        }
      `}</style>

      <nav className="nav-root">
        <div className="nav-logo">
          <div className="nav-logo-icon">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
            </svg>
          </div>
          <span className="nav-logo-wordmark">
            <span>Print</span>Kiosk
          </span>
        </div>

        <div className="nav-links">
          {["How it Works", "Pricing"].map((item) => (
            <button
              key={item}
              className="nav-link"
              onClick={() => onNav && onNav(item)}
            >
              {item}
            </button>
          ))}
          <button className="nav-cta" onClick={() => onNav && onNav("Get Started")}>
            Get started
          </button>
        </div>
      </nav>
    </>
  );
}
