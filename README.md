# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



# InstantPrint — Design System

A reference for all tokens, patterns, and components used across UploadPage, OptionsPage, SuccessPage, and Nav. Copy-paste any section to reuse.

---

## 1. Fonts

```html
<!-- In index.html <head> or via @import in CSS -->
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet">
```

| Role | Family | Weight | Usage |
|---|---|---|---|
| Display / Headline | `Playfair Display` | 700 | Page titles, OTP digits, price totals |
| Body / UI | `Outfit` | 300–600 | All other text, buttons, labels |

```css
/* Always set as base */
font-family: 'Outfit', sans-serif;

/* For headlines */
font-family: 'Playfair Display', serif;
```

---

## 2. Color Tokens

### Base Palette
```css
--bg:           #f0ede8;   /* Warm off-white — page background */
--surface:      #ffffff;   /* Card / panel surface */
--surface-muted:#f8fafc;   /* Inset / nested surfaces */
--surface-alt:  #f1f5f9;   /* Toggle group background, skeletons */

--text-primary: #0f172a;   /* Headlines, strong labels */
--text-body:    #1e293b;   /* Normal body text */
--text-muted:   #64748b;   /* Secondary / helper text */
--text-faint:   #94a3b8;   /* Placeholders, hints, disabled */

--border:       #e2e8f0;   /* Default borders, dividers */
--border-focus: #93c5fd;   /* Hover / focused borders */
```

### Brand Blue
```css
--blue-50:  #eff6ff;
--blue-100: #dbeafe;
--blue-300: #93c5fd;
--blue-400: #60a5fa;
--blue-600: #2563eb;   /* Primary CTA, active states */
--blue-700: #1d4ed8;   /* Gradient start */
--blue-900: #1e3a8a;

/* Primary gradient */
background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 60%, #3b82f6 100%);
```

### Success Green
```css
--green-100: #d1fae5;
--green-400: #6ee7b7;
--green-500: #10b981;  /* Checkmarks, done states, savings */
--green-600: #059669;
--green-bg:  #ecfdf5;
```

### Semantic
```css
--error:    #ef4444;
--error-bg: #fff1f2;
--warning:  #f59e0b;
```

---

## 3. Typography Scale

```css
/* Display — Page headlines */
font-family: 'Playfair Display', serif;
font-size: clamp(1.8rem, 4vw, 2.15rem);
line-height: 1.18;
letter-spacing: -0.01em;
color: #0f172a;

/* Section heading */
font-size: 1.1rem;
font-weight: 600;
color: #0f172a;

/* Body */
font-size: 0.95rem;
font-weight: 400;
line-height: 1.6;
color: #64748b;

/* Label (uppercase) */
font-size: 0.68rem;
font-weight: 700;
letter-spacing: 0.1em;
text-transform: uppercase;
color: #94a3b8;

/* Small / hint */
font-size: 0.75rem;
font-weight: 400;
color: #94a3b8;

/* Micro badge text */
font-size: 0.72rem;
font-weight: 600;
letter-spacing: 0.08em;
```

---

## 4. Spacing & Layout

```css
/* Page padding */
padding: 2.5rem 1.5rem;

/* Card padding */
padding: 2.5rem 2rem;      /* Large card (UploadPage) */
padding: 1.6rem;           /* Options / compact card */

/* Section gap within card */
margin-bottom: 1.5rem;

/* Standard gap between elements */
gap: 1rem;
gap: 0.75rem;   /* tight */
gap: 1.5rem;    /* loose */
```

### Two-column layout (OptionsPage)
```css
.layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  align-items: start;
}

@media (max-width: 768px) {
  .layout { grid-template-columns: 1fr; }
}
```

---

## 5. Card

The core surface used everywhere.

```css
.card {
  background: #ffffff;
  border-radius: 24px;   /* Standard card */
  /* border-radius: 28px for hero/centered cards */
  box-shadow:
    0 4px 6px rgba(0,0,0,0.03),
    0 16px 40px rgba(0,0,0,0.07),
    0 0 0 1px rgba(0,0,0,0.04);   /* Subtle outline */
  overflow: hidden;
}
```

---

## 6. Page Background & Decorative Layer

Every page uses the same base. Copy this pattern:

```css
.page-root {
  min-height: 100vh;
  background: #f0ede8;
  padding: 2.5rem 1.5rem;
  font-family: 'Outfit', sans-serif;
  position: relative;
  overflow: hidden;
}

/* Ambient gradient mesh */
.page-root::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 700px 500px at 75% 15%, rgba(37,99,235,0.06) 0%, transparent 70%),
    radial-gradient(ellipse 500px 400px at 10% 85%, rgba(16,185,129,0.04) 0%, transparent 60%);
  pointer-events: none;
}
```

### Decorative rings (absolutely positioned)
```css
/* Reusable via inline style */
.deco-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(37,99,235,0.08);
  pointer-events: none;
}

/* Usage: */
<div class="deco-ring" style="width:380px;height:380px;top:-120px;right:-100px" />
<div class="deco-ring" style="width:200px;height:200px;bottom:60px;left:60px" />
```

### Dot grid accent
```css
.deco-dot-grid {
  position: absolute;
  width: 120px; height: 120px;
  background-image: radial-gradient(circle, rgba(37,99,235,0.14) 1.5px, transparent 1.5px);
  background-size: 16px 16px;
  pointer-events: none;
  /* Position varies per page */
  top: 50px; left: 50px;
}
```

---

## 7. Animations

```css
/* Standard entrance — used on cards and sections */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Hero card entrance */
@keyframes cardIn {
  from { opacity: 0; transform: translateY(24px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

/* Staggered element pop-in */
@keyframes popIn {
  from { opacity: 0; transform: scale(0.7); }
  to   { opacity: 1; transform: scale(1); }
}

/* Usage with stagger */
.el { animation: fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both; }
.el:nth-child(2) { animation-delay: 0.1s; }
.el:nth-child(3) { animation-delay: 0.2s; }

/* Shimmer (skeleton loaders) */
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}

.shimmer {
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%);
  background-size: 200% 100%;
  animation: shimmer 1.4s ease-in-out infinite;
}

/* Ripple (SuccessPage icon) */
@keyframes ripple {
  0%   { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.5); opacity: 0; }
}

/* Pulse dot */
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.5; transform: scale(0.75); }
}

/* Spin (loading icon) */
@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
```

**Easing** — always use `cubic-bezier(0.22, 1, 0.36, 1)` for entrances (snappy spring feel).

---

## 8. Badges & Chips

### Page badge (step indicator)
```css
.page-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(37,99,235,0.08);
  color: #2563eb;
  border-radius: 100px;
  padding: 5px 14px;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
```

### Live dot (animated)
```css
.badge-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #2563eb;
  animation: pulse 2s infinite;
}
```

### Pill chip (file type, etc.)
```css
.chip {
  background: #eff6ff;
  color: #2563eb;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 3px 10px;
  border-radius: 100px;
}
```

### Savings badge (on dark bg)
```css
.savings-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(255,255,255,0.15);
  border-radius: 100px;
  padding: 2px 8px;
  font-size: 0.68rem;
  font-weight: 600;
  color: rgba(255,255,255,0.9);
}
```

---

## 9. Step Trail

Used on OptionsPage and SuccessPage.

```css
.step-trail {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 2rem;
}

.step-t { display: flex; align-items: center; gap: 7px; }

.step-t-num {
  width: 22px; height: 22px;
  border-radius: 50%;
  font-size: 0.66rem;
  font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}

/* States */
.step-t-num.done     { background: #10b981; color: white; }
.step-t-num.active   { background: #2563eb; color: white; box-shadow: 0 0 0 3px rgba(37,99,235,0.15); }
.step-t-num.upcoming { background: #e2e8f0; color: #94a3b8; }

.step-t-label { font-size: 0.72rem; font-weight: 600; }
.step-t-label.done     { color: #10b981; }
.step-t-label.active   { color: #2563eb; }
.step-t-label.upcoming { color: #94a3b8; }

/* Connector line between steps */
.step-connector {
  flex: 1;
  height: 1px;
  background: #e2e8f0;
  margin: 0 10px;
  min-width: 20px;
}

/* All-done variant (SuccessPage) — green connectors */
.step-connector.done { background: #d1fae5; }
```

```jsx
// JSX pattern
{[
  { label: "Upload", state: "done" },
  { label: "Options", state: "active" },
  { label: "Pay", state: "upcoming" },
  { label: "Collect", state: "upcoming" },
].map(({ label, state }, i, arr) => (
  <div key={label} style={{ display: "flex", alignItems: "center", flex: i < arr.length - 1 ? 1 : undefined }}>
    <div className="step-t">
      <div className={`step-t-num ${state}`}>
        {state === "done"
          ? <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          : i + 1}
      </div>
      <span className={`step-t-label ${state}`}>{label}</span>
    </div>
    {i < arr.length - 1 && <div className="step-connector" />}
  </div>
))}
```

---

## 10. Toggle / Segmented Control

```css
.toggle-group {
  display: flex;
  background: #f1f5f9;
  border-radius: 14px;
  padding: 4px;
  gap: 4px;
}

.toggle-btn {
  flex: 1;
  padding: 0.6rem 0.5rem;
  border-radius: 10px;
  border: none;
  font-family: 'Outfit', sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s cubic-bezier(0.22,1,0.36,1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.toggle-btn.active {
  background: white;
  color: #1e293b;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.04);
}

.toggle-btn.inactive {
  background: transparent;
  color: #94a3b8;
}

.toggle-btn.inactive:hover {
  color: #64748b;
  background: rgba(255,255,255,0.5);
}

/* Optional icon + sublabel pattern */
.toggle-icon { font-size: 1.1rem; }
.toggle-sub  { font-size: 0.65rem; font-weight: 500; opacity: 0.65; }
```

---

## 11. Stepper (Copies counter)

```css
.stepper { display: flex; align-items: center; gap: 1rem; }

.stepper-btn {
  width: 38px; height: 38px;
  border-radius: 12px;
  border: 1.5px solid #e2e8f0;
  background: white;
  color: #475569;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s;
  font-weight: 600;
}

.stepper-btn:hover   { border-color: #93c5fd; color: #2563eb; background: #eff6ff; }
.stepper-btn:active  { transform: scale(0.94); }
.stepper-btn:disabled { opacity: 0.35; cursor: not-allowed; }

.stepper-val {
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;
  color: #0f172a;
  min-width: 2rem;
  text-align: center;
}

.stepper-hint { font-size: 0.75rem; color: #94a3b8; margin-left: auto; }
```

---

## 12. Primary CTA Button

```css
.cta-btn {
  width: 100%;
  padding: 1rem;
  border-radius: 16px;
  border: none;
  font-family: 'Outfit', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 60%, #3b82f6 100%);
  color: white;
  box-shadow: 0 4px 16px rgba(37,99,235,0.3), 0 1px 3px rgba(37,99,235,0.2);
  transition: all 0.2s cubic-bezier(0.22, 1, 0.36, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
}

/* Shine sweep on hover */
.cta-btn::after {
  content: '';
  position: absolute;
  top: 0; left: -100%;
  width: 60%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
  transform: skewX(-20deg);
  transition: left 0.5s;
}

.cta-btn:hover         { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(37,99,235,0.35); }
.cta-btn:hover::after  { left: 150%; }
.cta-btn:active        { transform: translateY(0); }

/* Disabled state */
.cta-btn:disabled {
  background: #f1f5f9;
  color: #cbd5e1;
  cursor: not-allowed;
  box-shadow: none;
}

/* Animated arrow icon inside */
.cta-arrow { transition: transform 0.2s; }
.cta-btn:hover .cta-arrow { transform: translateX(4px); }
```

### Ghost / secondary button
```css
.ghost-btn {
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
}

.ghost-btn:hover {
  border-color: #93c5fd;
  color: #2563eb;
  background: #f0f7ff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37,99,235,0.08);
}
```

---

## 13. Price Card (Dark gradient surface)

```css
.price-card {
  background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 60%, #3b82f6 100%);
  border-radius: 18px;
  padding: 1.25rem 1.4rem;
  position: relative;
  overflow: hidden;
}

/* Decorative orbs inside */
.price-card::before {
  content: '';
  position: absolute;
  top: -30px; right: -30px;
  width: 120px; height: 120px;
  border-radius: 50%;
  background: rgba(255,255,255,0.06);
}

.price-card::after {
  content: '';
  position: absolute;
  bottom: -20px; left: 20px;
  width: 80px; height: 80px;
  border-radius: 50%;
  background: rgba(255,255,255,0.04);
}

.price-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.78rem;
  color: rgba(255,255,255,0.7);
  margin-bottom: 4px;
}

.price-divider { height: 1px; background: rgba(255,255,255,0.15); margin: 0.75rem 0; }

.price-total-val {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  color: white;
}
```

---

## 14. Drop Zone (UploadPage)

```css
.drop-zone {
  border-radius: 20px;
  border: 2px dashed #cbd5e1;
  background: #f8fafc;
  padding: 2.5rem 1.5rem;
  cursor: pointer;
  text-align: center;
  transition: border-color 0.2s, background 0.2s, box-shadow 0.2s, transform 0.2s;
  position: relative;
  overflow: hidden;
}

/* Gradient wash on hover */
.drop-zone::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 0%, rgba(37,99,235,0.06), transparent 70%);
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.drop-zone:hover              { border-color: #93c5fd; background: #f0f7ff; box-shadow: 0 0 0 4px rgba(37,99,235,0.06); }
.drop-zone:hover::after       { opacity: 1; }
.drop-zone.dragging           { border-color: #2563eb; background: #eff6ff; box-shadow: 0 0 0 6px rgba(37,99,235,0.1); transform: scale(1.015); }
.drop-zone.has-file           { border-style: solid; border-color: #6ee7b7; background: #f0fdf4; cursor: default; }
```

---

## 15. Trust Row

```css
.trust-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 0.75rem;
  font-size: 0.72rem;
  color: #94a3b8;
}

.trust-dot {
  width: 3px; height: 3px;
  border-radius: 50%;
  background: #cbd5e1;
}
```

```jsx
<div className="trust-row">
  <LockIcon /> Secure checkout
  <div className="trust-dot" />
  Cancel anytime
  <div className="trust-dot" />
  Instant confirmation
</div>
```

---

## 16. Horizontal Divider

```css
/* Fades out at edges — use between sections */
.divider {
  height: 1px;
  background: linear-gradient(to right, transparent, #e2e8f0, transparent);
  margin: 1.5rem 0;
}
```

---

## 17. Nav

```css
.nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 62px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  background: rgba(240, 237, 232, 0.82);   /* matches --bg with alpha */
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(0,0,0,0.06);
  z-index: 50;
}

/* Account for fixed nav on page content */
.page-root { padding-top: calc(62px + 2rem); }
```

---

## 18. OTP Tiles

```css
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
}

/* Staggered entrance */
.otp-tile { animation: tileIn 0.4s cubic-bezier(0.22,1,0.36,1) both; }
.otp-tile:nth-child(1) { animation-delay: 0.4s; }
.otp-tile:nth-child(2) { animation-delay: 0.48s; }
.otp-tile:nth-child(3) { animation-delay: 0.56s; }
.otp-tile:nth-child(4) { animation-delay: 0.64s; }

@keyframes tileIn {
  from { opacity: 0; transform: translateY(14px) scale(0.9); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
```

---

## 19. Skeleton / Loading State

```css
.skeleton {
  position: relative;
  background: #f1f5f9;
  border-radius: 4px;
  overflow: hidden;
}

.skeleton::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%);
  background-size: 200% 100%;
  animation: shimmer 1.4s ease-in-out infinite;
}
```

---

## 20. Shadow Scale Reference

```css
/* Subtle — inputs, nested elements */
box-shadow: 0 1px 3px rgba(0,0,0,0.06);

/* Default card */
box-shadow:
  0 4px 6px rgba(0,0,0,0.03),
  0 16px 40px rgba(0,0,0,0.07),
  0 0 0 1px rgba(0,0,0,0.04);

/* Elevated card / hero */
box-shadow:
  0 4px 6px rgba(0,0,0,0.03),
  0 20px 50px rgba(0,0,0,0.08),
  0 0 0 1px rgba(0,0,0,0.04);

/* Blue glow (CTA button rest) */
box-shadow: 0 4px 16px rgba(37,99,235,0.3), 0 1px 3px rgba(37,99,235,0.2);

/* Blue glow (CTA button hover) */
box-shadow: 0 8px 24px rgba(37,99,235,0.35);

/* Focus ring */
box-shadow: 0 0 0 3px rgba(37,99,235,0.15);

/* PDF / document card */
box-shadow:
  0 0 0 1px rgba(0,0,0,0.08),
  0 4px 8px rgba(0,0,0,0.08),
  0 12px 32px rgba(0,0,0,0.12);
```
