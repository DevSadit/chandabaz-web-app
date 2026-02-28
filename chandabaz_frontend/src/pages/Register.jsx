import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Shield,
  Eye,
  EyeOff,
  UserPlus,
  Lock,
  Globe,
  Star,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";

const BENEFITS = [
  {
    icon: Shield,
    title: "Fully Anonymous",
    desc: "Report without revealing your identity",
  },
  {
    icon: Lock,
    title: "Secure & Encrypted",
    desc: "Your data is protected at every step",
  },
  {
    icon: Globe,
    title: "Nationwide Impact",
    desc: "Reach thousands of concerned citizens",
  },
  {
    icon: Star,
    title: "Expert Review",
    desc: "Reports verified by our moderation team",
  },
];

/* ─── Styles ─── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');

  .reg-root * { box-sizing: border-box; }
  .reg-root { font-family: 'DM Sans', sans-serif; }

  /* ── Layout ── */
  .reg-wrap { min-height: calc(100vh - 64px); display: flex; }

  /* ── Left panel ── */
  .reg-left {
    display: none;
    width: 45%; flex-direction: column; justify-content: space-between;
    padding: 56px 52px;
    background: #0A0F0D;
    position: relative; overflow: hidden; flex-shrink: 0;
  }
  @media (min-width: 1024px) { .reg-left { display: flex; } }

  .reg-left-noise {
    position: absolute; inset: 0; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
    opacity: 0.03;
  }
  .reg-left-grid {
    position: absolute; inset: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(1,145,69,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(1,145,69,0.04) 1px, transparent 1px);
    background-size: 48px 48px;
  }
  .reg-left::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(1,145,69,0.6), transparent);
  }
  .reg-glow-a {
    position: absolute; bottom: -15%; right: -10%; width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(1,145,69,0.18) 0%, transparent 65%);
    filter: blur(80px); pointer-events: none;
  }
  .reg-glow-b {
    position: absolute; top: -10%; left: -10%; width: 380px; height: 380px;
    background: radial-gradient(circle, rgba(1,145,69,0.10) 0%, transparent 65%);
    filter: blur(60px); pointer-events: none;
  }
  .reg-left-top { position: relative; z-index: 2; }

  /* Brand */
  .reg-brand { display: flex; align-items: center; gap: 12px; margin-bottom: 48px; }
  .reg-brand-mark {
    width: 38px; height: 38px; border-radius: 2px; background: #019145;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .reg-brand-mark img { width: 30px; height: 30px; object-fit: contain; }
  .reg-brand-name {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 20px; font-weight: 800; color: #fff; letter-spacing: -0.02em;
  }
  .reg-brand-name span { color: #019145; }
  .reg-brand-sub {
    font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase;
    color: rgba(168,212,184,0.6); margin-top: 1px;
  }

  /* Headline */
  .reg-headline {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(1.9rem, 2.8vw, 2.6rem);
    font-weight: 900; line-height: 1.1; letter-spacing: -0.02em;
    color: #fff; margin: 0 0 14px;
  }
  .reg-headline span {
    background: linear-gradient(135deg, #5ddc9a 0%, #019145 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .reg-subhead {
    font-size: 13px; color: rgba(168,212,184,0.65); line-height: 1.8;
    max-width: 340px; margin: 0 0 40px;
  }

  /* Benefit cards */
  .reg-benefits { display: flex; flex-direction: column; gap: 10px; }
  .reg-benefit {
    display: flex; align-items: center; gap: 14px;
    padding: 14px 16px;
    border: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.03);
    border-radius: 2px;
    transition: border-color 0.2s, background 0.2s;
  }
  .reg-benefit:hover { border-color: rgba(1,145,69,0.25); background: rgba(1,145,69,0.04); }
  .reg-benefit-icon {
    width: 34px; height: 34px; border-radius: 2px; flex-shrink: 0;
    background: rgba(1,145,69,0.12);
    border: 1px solid rgba(1,145,69,0.20);
    display: flex; align-items: center; justify-content: center;
  }
  .reg-benefit-title { font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.85); margin: 0 0 2px; }
  .reg-benefit-desc  { font-size: 11px; color: rgba(168,212,184,0.55); margin: 0; }

  /* Social proof */
  .reg-social {
    position: relative; z-index: 2;
    display: flex; align-items: center; gap: 14px;
    border: 1px solid rgba(255,255,255,0.07);
    background: rgba(255,255,255,0.03);
    padding: 16px 20px; border-radius: 2px;
  }
  .reg-avatars { display: flex; flex-shrink: 0; }
  .reg-avatar {
    width: 30px; height: 30px; border-radius: 2px;
    background: rgba(1,145,69,0.25); border: 2px solid #0A0F0D;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 800; color: #fff;
    margin-right: -6px;
  }
  .reg-social-title { font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.85); margin: 0 0 2px; }
  .reg-social-sub   { font-size: 11px; color: rgba(168,212,184,0.55); margin: 0; }

  /* ── Right panel ── */
  .reg-right {
    flex: 1; display: flex; align-items: flex-start; justify-content: center;
    background: #F7F5F0; padding: 40px 24px;
    overflow-y: auto;
  }
  .reg-form-wrap { width: 100%; max-width: 420px; padding: 8px 0; }

  /* Mobile brand */
  .reg-mobile-brand { display: flex; align-items: center; gap: 10px; margin-bottom: 32px; }
  .reg-mobile-mark {
    width: 32px; height: 32px; border-radius: 2px; background: #019145;
    display: flex; align-items: center; justify-content: center;
  }
  .reg-mobile-name {
    font-family: 'Playfair Display', serif;
    font-size: 18px; font-weight: 800; color: #0A0F0D; letter-spacing: -0.02em;
  }
  .reg-mobile-name span { color: #019145; }
  @media (min-width: 1024px) { .reg-mobile-brand { display: none; } }

  /* Form heading */
  .reg-form-heading { margin-bottom: 28px; }
  .reg-form-eyebrow {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 10px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase;
    color: #019145; margin-bottom: 10px;
  }
  .reg-form-eyebrow::before, .reg-form-eyebrow::after {
    content: ''; display: block; width: 16px; height: 1px; background: #019145; opacity: 0.4;
  }
  .reg-form-h1 {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 26px; font-weight: 800; color: #0A0F0D;
    letter-spacing: -0.02em; margin: 0 0 5px;
  }
  .reg-form-sub { font-size: 13px; color: #6B7B73; margin: 0; }

  /* Card */
  .reg-card {
    background: #fff;
    border: 1px solid rgba(1,145,69,0.12);
    border-radius: 2px;
    padding: 32px 28px;
    box-shadow: 0 4px 32px rgba(0,0,0,0.05);
  }

  /* Fields */
  .reg-field { margin-bottom: 18px; }
  .reg-label {
    display: block; font-size: 11px; font-weight: 700;
    letter-spacing: 0.10em; text-transform: uppercase;
    color: #3A4A42; margin-bottom: 7px;
  }
  .reg-input {
    width: 100%; padding: 10px 14px;
    font-family: 'DM Sans', sans-serif; font-size: 14px; color: #0A0F0D;
    background: #FAFAF8;
    border: 1px solid rgba(1,145,69,0.15);
    border-radius: 2px; outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .reg-input::placeholder { color: #9AA8A0; }
  .reg-input:focus {
    border-color: #019145;
    box-shadow: 0 0 0 3px rgba(1,145,69,0.10);
    background: #fff;
  }
  .reg-pw-wrap { position: relative; }
  .reg-pw-toggle {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer; padding: 4px;
    color: #9AA8A0; transition: color 0.2s; display: flex; align-items: center;
  }
  .reg-pw-toggle:hover { color: #019145; }

  /* Method toggle */
  .reg-method-toggle {
    display: flex; border: 1px solid rgba(1,145,69,0.15);
    border-radius: 2px; overflow: hidden; margin-bottom: 10px;
    background: #FAFAF8;
  }
  .reg-method-btn {
    flex: 1; padding: 9px; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 700;
    letter-spacing: 0.10em; text-transform: uppercase;
    background: transparent; color: #9AA8A0;
    transition: background 0.2s, color 0.2s;
    border-right: 1px solid rgba(1,145,69,0.12);
  }
  .reg-method-btn:last-child { border-right: none; }
  .reg-method-btn.active {
    background: #019145; color: #fff;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.1);
  }
  .reg-method-btn:not(.active):hover { background: rgba(1,145,69,0.06); color: #019145; }

  /* Notice box */
  .reg-notice {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 12px 14px;
    background: rgba(251,191,36,0.06);
    border: 1px solid rgba(251,191,36,0.22);
    border-radius: 2px; margin-bottom: 18px;
  }
  .reg-notice-check {
    width: 16px; height: 16px; border-radius: 2px; margin-top: 1px;
    border: 1px solid rgba(1,145,69,0.30); flex-shrink: 0;
    accent-color: #019145; cursor: pointer;
  }
  .reg-notice p { font-size: 11px; color: #92400E; line-height: 1.7; margin: 0; }

  /* Submit */
  .reg-submit {
    width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 13px 20px; border-radius: 2px;
    background: #019145; color: #fff;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase;
    border: none; cursor: pointer;
    transition: background 0.2s, transform 0.15s;
    box-shadow: 0 4px 20px rgba(1,145,69,0.25);
  }
  .reg-submit:hover:not(:disabled) { background: #016934; transform: translateY(-1px); }
  .reg-submit:disabled { opacity: 0.6; cursor: not-allowed; }

  /* Footer */
  .reg-card-footer {
    margin-top: 22px; padding-top: 18px;
    border-top: 1px solid rgba(1,145,69,0.08);
    text-align: center;
  }
  .reg-card-footer p { font-size: 13px; color: #6B7B73; margin: 0; }
  .reg-card-footer a {
    color: #019145; font-weight: 700; text-decoration: none;
    border-bottom: 1px solid rgba(1,145,69,0.3);
    transition: border-color 0.2s;
  }
  .reg-card-footer a:hover { border-color: #019145; }

  .reg-fine {
    text-align: center; font-size: 11px; color: #9AA8A0;
    margin-top: 18px; line-height: 1.6;
  }
`;

export default function Register() {
  const { register, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState("email");

  if (isLoggedIn) {
    navigate("/");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        password: form.password,
        ...(loginMethod === "email"
          ? { email: form.email }
          : { phone: form.phone }),
      };
      await register(payload);
      toast.success("Account created! Welcome to ChandaBaz.");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reg-root">
      <style>{css}</style>
      <div className="reg-wrap">
        {/* ══ LEFT PANEL ══ */}
        <div className="reg-left">
          <div className="reg-left-noise" />
          <div className="reg-left-grid" />
          <div className="reg-glow-a" />
          <div className="reg-glow-b" />

          <div className="reg-left-top">
            {/* Brand */}
            <div className="reg-brand">
              <div className="reg-brand-mark">
                <img
                  src="/Chandabaz_logo.png"
                  alt="ChandaBaz"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
              <div>
                <div className="reg-brand-name">
                  Chanda<span>Baz</span>
                </div>
                <div className="reg-brand-sub">Transparency Platform</div>
              </div>
            </div>

            {/* Headline */}
            <h2 className="reg-headline">
              Join the fight
              <br />
              <span>against corruption.</span>
            </h2>
            <p className="reg-subhead">
              Create a free account and start reporting corruption with full
              anonymity and security.
            </p>

            {/* Benefits */}
            <div className="reg-benefits">
              {BENEFITS.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="reg-benefit">
                  <div className="reg-benefit-icon">
                    <Icon size={15} color="rgba(1,145,69,0.85)" />
                  </div>
                  <div>
                    <p className="reg-benefit-title">{title}</p>
                    <p className="reg-benefit-desc">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social proof */}
          <div className="reg-social">
            <div className="reg-avatars">
              {["A", "B", "C"].map((l) => (
                <div key={l} className="reg-avatar">
                  {l}
                </div>
              ))}
              <div style={{ width: 6 }} />
            </div>
            <div>
              <p className="reg-social-title">500+ reports submitted</p>
              <p className="reg-social-sub">
                Join our growing community of whistleblowers
              </p>
            </div>
          </div>
        </div>

        {/* ══ RIGHT PANEL ══ */}
        <div className="reg-right">
          <div className="reg-form-wrap">
            {/* Mobile brand */}
            <div className="reg-mobile-brand">
              <div className="reg-mobile-mark">
                <Shield size={16} color="#fff" />
              </div>
              <span className="reg-mobile-name">
                Chanda<span>Baz</span>
              </span>
            </div>

            {/* Heading */}
            <div className="reg-form-heading">
              <div className="reg-form-eyebrow">Create Account</div>
              <h1 className="reg-form-h1">Create your account</h1>
              <p className="reg-form-sub">
                Free forever. No credit card required.
              </p>
            </div>

            {/* Card */}
            <div className="reg-card">
              <form onSubmit={handleSubmit}>
                {/* Full name */}
                <div className="reg-field">
                  <label className="reg-label">Full Name</label>
                  <input
                    type="text"
                    className="reg-input"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    autoFocus
                  />
                </div>

                {/* Method + contact */}
                <div className="reg-field">
                  <label className="reg-label">Sign up with</label>
                  <div className="reg-method-toggle">
                    {["email", "phone"].map((m) => (
                      <button
                        key={m}
                        type="button"
                        className={`reg-method-btn${loginMethod === m ? " active" : ""}`}
                        onClick={() => setLoginMethod(m)}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                  {loginMethod === "email" ? (
                    <input
                      type="email"
                      className="reg-input"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      required
                    />
                  ) : (
                    <input
                      type="tel"
                      className="reg-input"
                      placeholder="01700000000"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      required
                      pattern="[0-9]{10,15}"
                    />
                  )}
                </div>

                {/* Password */}
                <div className="reg-field">
                  <label className="reg-label">Password</label>
                  <div className="reg-pw-wrap">
                    <input
                      type={showPw ? "text" : "password"}
                      className="reg-input"
                      style={{ paddingRight: 42 }}
                      placeholder="Min. 6 characters"
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="reg-pw-toggle"
                      onClick={() => setShowPw(!showPw)}
                    >
                      {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Confirm password */}
                <div className="reg-field">
                  <label className="reg-label">Confirm Password</label>
                  <input
                    type="password"
                    className="reg-input"
                    placeholder="Re-enter password"
                    value={form.confirm}
                    onChange={(e) =>
                      setForm({ ...form, confirm: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Notice / agreement */}
                <div className="reg-notice">
                  <input
                    type="checkbox"
                    required
                    className="reg-notice-check"
                  />
                  <p>
                    I agree to report only genuine corruption evidence. False
                    reports may result in account suspension.
                  </p>
                </div>

                {/* Submit */}
                <button type="submit" disabled={loading} className="reg-submit">
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" /> Creating account…
                    </>
                  ) : (
                    <>
                      <UserPlus size={15} /> Create Free Account
                    </>
                  )}
                </button>
              </form>

              <div className="reg-card-footer">
                <p>
                  Already have an account?{" "}
                  <Link to="/login">
                    Sign in{" "}
                    <ArrowRight
                      size={11}
                      style={{ display: "inline", verticalAlign: "middle" }}
                    />
                  </Link>
                </p>
              </div>
            </div>

            <p className="reg-fine">
              By creating an account you agree to our terms of service and
              privacy policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
