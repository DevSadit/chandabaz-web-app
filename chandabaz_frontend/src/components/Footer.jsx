import { Link } from "react-router-dom";
import { Shield, ArrowRight, Eye, FileCheck, Users } from "lucide-react";

const footerLinks = {
  Platform: [
    { label: "Browse Reports", to: "/" },
    { label: "Submit Evidence", to: "/submit" },
    { label: "Create Account", to: "/register" },
    { label: "Sign In", to: "/login" },
  ],
  About: [
    { label: "Our Mission", to: "/#mission" },
    { label: "How It Works", to: "/#how" },
    { label: "Privacy Policy", to: "/" },
    { label: "Terms of Use", to: "/" },
  ],
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');

  .ft-root * { box-sizing: border-box; }
  .ft-root { font-family: 'DM Sans', sans-serif; }

  /* ── CTA strip ── */
  .ft-cta {
    background: #019145;
    position: relative; overflow: hidden;
  }
  .ft-cta::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
  }
  .ft-cta-grid {
    position: absolute; inset: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 48px 48px;
  }
  .ft-cta-inner {
    max-width: 1280px; margin: 0 auto; padding: 44px 32px;
    position: relative; z-index: 2;
    display: flex; align-items: center; justify-content: space-between;
    gap: 24px; flex-wrap: wrap;
  }
  @media (max-width: 640px) { .ft-cta-inner { padding: 36px 20px; } }

  .ft-cta-h {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 22px; font-weight: 800; color: #fff;
    letter-spacing: -0.02em; margin: 0 0 6px;
  }
  .ft-cta-sub { font-size: 13px; color: rgba(255,255,255,0.65); margin: 0; line-height: 1.6; }

  .ft-cta-btn {
    display: inline-flex; align-items: center; gap: 8px; flex-shrink: 0;
    padding: 12px 24px; border-radius: 2px;
    background: #fff; color: #019145;
    font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase;
    border: none; cursor: pointer; text-decoration: none;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 20px rgba(0,0,0,0.12);
  }
  .ft-cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,0.18); }

  /* ── Main footer ── */
  .ft-main {
    background: #0A0F0D;
    position: relative; overflow: hidden;
  }
  /* noise */
  .ft-noise {
    position: absolute; inset: 0; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
    opacity: 0.025;
  }
  /* subtle grid */
  .ft-grid-bg {
    position: absolute; inset: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(1,145,69,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(1,145,69,0.04) 1px, transparent 1px);
    background-size: 64px 64px;
  }
  /* glow */
  .ft-glow {
    position: absolute; bottom: -20%; left: -5%; width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(1,145,69,0.10) 0%, transparent 65%);
    filter: blur(80px); pointer-events: none;
  }

  .ft-main-inner {
    max-width: 1280px; margin: 0 auto; padding: 64px 32px 0;
    position: relative; z-index: 2;
  }
  @media (max-width: 640px) { .ft-main-inner { padding: 48px 20px 0; } }

  .ft-cols {
    display: grid;
    grid-template-columns: 1.8fr 1fr 1fr;
    gap: 48px;
  }
  @media (max-width: 900px) { .ft-cols { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 560px) { .ft-cols { grid-template-columns: 1fr; gap: 36px; } }

  /* Brand col */
  .ft-brand-logo {
    display: inline-flex; align-items: center; gap: 10px;
    text-decoration: none; margin-bottom: 20px;
  }
  .ft-brand-mark {
    width: 34px; height: 34px; border-radius: 2px; background: #019145;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    transition: background 0.2s;
  }
  .ft-brand-logo:hover .ft-brand-mark { background: #016934; }
  .ft-brand-mark img { width: 26px; height: 26px; object-fit: contain; }
  .ft-brand-name {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 18px; font-weight: 800; color: #fff; letter-spacing: -0.02em;
  }
  .ft-brand-name span { color: #019145; }
  .ft-brand-sub {
    font-size: 9px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
    color: rgba(168,212,184,0.45); margin-top: 1px;
  }

  .ft-brand-desc {
    font-size: 13px; color: rgba(255,255,255,0.38); line-height: 1.85;
    max-width: 320px; margin: 0 0 24px;
  }

  /* Trust badges */
  .ft-badges { display: flex; flex-wrap: wrap; gap: 8px; }
  .ft-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 5px 12px; border-radius: 2px;
    border: 1px solid rgba(1,145,69,0.18);
    background: rgba(1,145,69,0.06);
    font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
    color: rgba(168,212,184,0.70);
    transition: border-color 0.2s, background 0.2s;
  }
  .ft-badge:hover { border-color: rgba(1,145,69,0.35); background: rgba(1,145,69,0.10); }

  /* Link cols */
  .ft-col-heading {
    font-size: 9px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase;
    color: rgba(255,255,255,0.30); margin: 0 0 18px;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(1,145,69,0.10);
  }
  .ft-links { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
  .ft-link {
    display: inline-flex; align-items: center; gap: 0;
    font-size: 13px; color: rgba(255,255,255,0.40); text-decoration: none; font-weight: 500;
    transition: color 0.2s, gap 0.2s;
    position: relative;
  }
  .ft-link::before {
    content: '';
    display: inline-block; width: 0; height: 1px;
    background: #019145; margin-right: 0;
    transition: width 0.25s, margin-right 0.25s;
    vertical-align: middle;
  }
  .ft-link:hover { color: rgba(255,255,255,0.85); }
  .ft-link:hover::before { width: 10px; margin-right: 7px; }

  /* ── Bottom bar ── */
  .ft-bottom {
    margin-top: 56px;
    padding: 20px 0;
    border-top: 1px solid rgba(1,145,69,0.10);
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 12px;
    position: relative; z-index: 2;
  }
  .ft-copy { font-size: 11px; color: rgba(255,255,255,0.25); margin: 0; }
  .ft-live {
    display: inline-flex; align-items: center; gap: 7px;
    font-size: 11px; color: rgba(255,255,255,0.25);
  }
  .ft-live-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #019145; box-shadow: 0 0 6px #019145;
    animation: ft-pulse 2s infinite;
    flex-shrink: 0;
  }
  @keyframes ft-pulse {
    0%,100% { opacity:1; transform:scale(1); }
    50% { opacity:0.55; transform:scale(0.8); }
  }
`;

export default function Footer() {
  return (
    <div className="ft-root">
      <style>{css}</style>

      {/* ══ CTA STRIP ══ */}
      <div className="ft-cta">
        <div className="ft-cta-grid" />
        <div className="ft-cta-inner">
          <div>
            <h3 className="ft-cta-h">Ready to expose corruption?</h3>
            <p className="ft-cta-sub">
              Your evidence can make a difference. Submit anonymously — safely.
            </p>
          </div>
          <Link to="/submit" className="ft-cta-btn">
            Submit Evidence <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* ══ MAIN FOOTER ══ */}
      <footer className="ft-main">
        <div className="ft-noise" />
        <div className="ft-grid-bg" />
        <div className="ft-glow" />

        <div className="ft-main-inner">
          <div className="ft-cols">
            {/* ── Brand ── */}
            <div>
              <Link to="/" className="ft-brand-logo">
                <div className="ft-brand-mark">
                  <img
                    src="/Chandabaz_logo.png"
                    alt="ChandaBaz"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
                <div>
                  <div className="ft-brand-name">
                    Chanda<span>Baz</span>
                  </div>
                  <div className="ft-brand-sub">Transparency Platform</div>
                </div>
              </Link>

              <p className="ft-brand-desc">
                ChandaBaz is a citizen-powered platform for reporting and
                documenting public corruption with verified evidence. Every
                report is reviewed, every identity is protected.
              </p>

              <div className="ft-badges">
                {[
                  { icon: Eye, text: "100% Anonymous" },
                  { icon: FileCheck, text: "Every Report Reviewed" },
                  { icon: Users, text: "Community Powered" },
                ].map(({ icon: Icon, text }) => (
                  <span key={text} className="ft-badge">
                    <Icon size={11} color="rgba(1,145,69,0.85)" />
                    {text}
                  </span>
                ))}
              </div>
            </div>

            {/* ── Link cols ── */}
            {Object.entries(footerLinks).map(([heading, links]) => (
              <div key={heading}>
                <p className="ft-col-heading">{heading}</p>
                <ul className="ft-links">
                  {links.map(({ label, to }) => (
                    <li key={label}>
                      <Link to={to} className="ft-link">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* ── Bottom bar ── */}
          <div className="ft-bottom">
            <p className="ft-copy">
              &copy; {new Date().getFullYear()} ChandaBaz &mdash; All rights
              reserved.
            </p>
            <span className="ft-live">
              <span className="ft-live-dot" />
              Platform is live &middot; Reports reviewed within 24 hours
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
