import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Eye,
  EyeOff,
  LogIn,
  FileText,
  Users,
  CheckCircle,
  Shield,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";

const TRUST_POINTS = [
  { icon: Shield, text: "End-to-end secure reporting" },
  { icon: FileText, text: "Multi-media evidence support" },
  { icon: Users, text: "Verified by expert moderators" },
  { icon: CheckCircle, text: "Anonymous submission option" },
];

/* ─── Styles ─── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');

  .login-root * { box-sizing: border-box; }
  .login-root { font-family: 'DM Sans', sans-serif; }

  /* ── Layout ── */
  .login-wrap {
    min-height: calc(100vh - 64px);
    display: flex;
  }

  /* ── Left panel ── */
  .login-left {
    display: none;
    width: 45%;
    flex-direction: column;
    justify-content: space-between;
    padding: 56px 52px;
    background: #0A0F0D;
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
  }
  @media (min-width: 1024px) { .login-left { display: flex; } }

  /* Noise overlay */
  .login-left-noise {
    position: absolute; inset: 0; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
    opacity: 0.03;
  }
  /* Grid texture */
  .login-left-grid {
    position: absolute; inset: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(1,145,69,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(1,145,69,0.04) 1px, transparent 1px);
    background-size: 48px 48px;
  }
  /* Top rule */
  .login-left::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(1,145,69,0.6), transparent);
  }
  /* Glows */
  .login-glow-a {
    position: absolute; bottom: -15%; left: -10%; width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(1,145,69,0.18) 0%, transparent 65%);
    filter: blur(80px); pointer-events: none;
  }
  .login-glow-b {
    position: absolute; top: -10%; right: -10%; width: 380px; height: 380px;
    background: radial-gradient(circle, rgba(1,145,69,0.10) 0%, transparent 65%);
    filter: blur(60px); pointer-events: none;
  }

  /* Left — top content */
  .login-left-top { position: relative; z-index: 2; }

  /* Brand lockup */
  .login-brand {
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 52px;
  }
  .login-brand-mark {
    width: 38px; height: 38px; border-radius: 2px;
    background: #019145;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .login-brand-mark img { width: 30px; height: 30px; object-fit: contain; }
  .login-brand-name {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 20px; font-weight: 800; color: #fff; letter-spacing: -0.02em;
  }
  .login-brand-name span { color: #019145; }
  .login-brand-sub {
    font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase;
    color: rgba(168,212,184,0.6); margin-top: 1px;
  }

  /* Headline */
  .login-headline {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(2rem, 3vw, 2.75rem);
    font-weight: 900; line-height: 1.1; letter-spacing: -0.02em;
    color: #fff; margin: 0 0 16px;
  }
  .login-headline span {
    background: linear-gradient(135deg, #5ddc9a 0%, #019145 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .login-subhead {
    font-size: 13px; color: rgba(168,212,184,0.65); line-height: 1.8;
    max-width: 340px; margin: 0 0 44px;
  }

  /* Trust points */
  .login-trust-list { display: flex; flex-direction: column; gap: 14px; }
  .login-trust-item {
    display: flex; align-items: center; gap: 12px;
  }
  .login-trust-icon {
    width: 32px; height: 32px; border-radius: 2px; flex-shrink: 0;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(1,145,69,0.20);
    display: flex; align-items: center; justify-content: center;
  }
  .login-trust-text {
    font-size: 13px; color: rgba(168,212,184,0.80); font-weight: 500;
  }

  /* Quote card */
  .login-quote {
    position: relative; z-index: 2;
    border: 1px solid rgba(255,255,255,0.07);
    background: rgba(255,255,255,0.03);
    backdrop-filter: blur(12px);
    padding: 20px 24px; border-radius: 2px;
  }
  .login-quote::before {
    content: '\u201C';
    position: absolute; top: -18px; left: 20px;
    font-family: 'Playfair Display', serif;
    font-size: 72px; line-height: 1; color: #019145; opacity: 0.35;
  }
  .login-quote p {
    font-size: 13px; color: rgba(168,212,184,0.70); line-height: 1.8;
    font-style: italic; margin: 0 0 8px;
  }
  .login-quote cite {
    font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
    color: rgba(1,145,69,0.7); font-style: normal;
  }

  /* ── Right panel ── */
  .login-right {
    flex: 1; display: flex; align-items: center; justify-content: center;
    background: #F7F5F0;
    padding: 48px 24px;
  }
  .login-form-wrap { width: 100%; max-width: 420px; }

  /* Mobile brand */
  .login-mobile-brand {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 36px;
  }
  .login-mobile-mark {
    width: 32px; height: 32px; border-radius: 2px; background: #019145;
    display: flex; align-items: center; justify-content: center;
  }
  .login-mobile-name {
    font-family: 'Playfair Display', serif;
    font-size: 18px; font-weight: 800; color: #0A0F0D; letter-spacing: -0.02em;
  }
  .login-mobile-name span { color: #019145; }
  @media (min-width: 1024px) { .login-mobile-brand { display: none; } }

  /* Form heading */
  .login-form-heading {
    margin-bottom: 32px;
  }
  .login-form-eyebrow {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 10px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase;
    color: #019145; margin-bottom: 10px;
  }
  .login-form-eyebrow::before, .login-form-eyebrow::after {
    content: ''; display: block; width: 16px; height: 1px; background: #019145; opacity: 0.4;
  }
  .login-form-h1 {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 28px; font-weight: 800; color: #0A0F0D;
    letter-spacing: -0.02em; margin: 0 0 6px;
  }
  .login-form-sub { font-size: 13px; color: #6B7B73; margin: 0; }

  /* Card */
  .login-card {
    background: #fff;
    border: 1px solid rgba(1,145,69,0.12);
    border-radius: 2px;
    padding: 36px 32px;
    box-shadow: 0 4px 32px rgba(0,0,0,0.05);
  }

  /* Form fields */
  .login-field { margin-bottom: 20px; }
  .login-label {
    display: block; font-size: 11px; font-weight: 700;
    letter-spacing: 0.10em; text-transform: uppercase;
    color: #3A4A42; margin-bottom: 8px;
  }
  .login-input {
    width: 100%; padding: 11px 14px;
    font-family: 'DM Sans', sans-serif; font-size: 14px; color: #0A0F0D;
    background: #FAFAF8;
    border: 1px solid rgba(1,145,69,0.15);
    border-radius: 2px; outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .login-input::placeholder { color: #9AA8A0; }
  .login-input:focus {
    border-color: #019145;
    box-shadow: 0 0 0 3px rgba(1,145,69,0.10);
    background: #fff;
  }
  .login-pw-wrap { position: relative; }
  .login-pw-toggle {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer; padding: 4px;
    color: #9AA8A0; transition: color 0.2s; display: flex; align-items: center;
  }
  .login-pw-toggle:hover { color: #019145; }

  /* Submit */
  .login-submit {
    width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 13px 20px; border-radius: 2px;
    background: #019145; color: #fff;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase;
    border: none; cursor: pointer;
    transition: background 0.2s, transform 0.15s;
    box-shadow: 0 4px 20px rgba(1,145,69,0.25);
    margin-top: 4px;
  }
  .login-submit:hover:not(:disabled) { background: #016934; transform: translateY(-1px); }
  .login-submit:disabled { opacity: 0.6; cursor: not-allowed; }

  /* Divider */
  .login-card-footer {
    margin-top: 24px; padding-top: 20px;
    border-top: 1px solid rgba(1,145,69,0.08);
    text-align: center;
  }
  .login-card-footer p { font-size: 13px; color: #6B7B73; margin: 0; }
  .login-card-footer a {
    color: #019145; font-weight: 700; text-decoration: none;
    border-bottom: 1px solid rgba(1,145,69,0.3);
    transition: border-color 0.2s;
  }
  .login-card-footer a:hover { border-color: #019145; }

  /* Fine print */
  .login-fine {
    text-align: center; font-size: 11px; color: #9AA8A0;
    margin-top: 20px; line-height: 1.6;
  }
`;

export default function Login() {
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({ emailOrPhone: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  if (isLoggedIn) {
    navigate(from, { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const isEmail = form.emailOrPhone.includes("@");
      const creds = {
        password: form.password,
        ...(isEmail
          ? { email: form.emailOrPhone }
          : { phone: form.emailOrPhone }),
      };
      await login(creds);
      toast.success("Welcome back!");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      <style>{css}</style>
      <div className="login-wrap">
        {/* ══ LEFT PANEL ══ */}
        <div className="login-left">
          <div className="login-left-noise" />
          <div className="login-left-grid" />
          <div className="login-glow-a" />
          <div className="login-glow-b" />

          <div className="login-left-top">
            {/* Brand */}
            <div className="login-brand">
              <div className="login-brand-mark">
                <img
                  src="/Chandabaz_logo.png"
                  alt="ChandaBaz"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
              <div>
                <div className="login-brand-name">
                  Chanda<span>Baz</span>
                </div>
                <div className="login-brand-sub">Transparency Platform</div>
              </div>
            </div>

            {/* Headline */}
            <h2 className="login-headline">
              Fight corruption.
              <br />
              <span>Your voice matters.</span>
            </h2>
            <p className="login-subhead">
              Join thousands of citizens holding power to account with verified,
              anonymous evidence.
            </p>

            {/* Trust points */}
            <div className="login-trust-list">
              {TRUST_POINTS.map(({ icon: Icon, text }) => (
                <div key={text} className="login-trust-item">
                  <div className="login-trust-icon">
                    <Icon size={14} color="rgba(1,145,69,0.85)" />
                  </div>
                  <span className="login-trust-text">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quote */}
          <div className="login-quote">
            <p>
              &ldquo;Corruption thrives in darkness. Every report you make is a
              beam of light.&rdquo;
            </p>
            <cite>— ChandaBaz Mission</cite>
          </div>
        </div>

        {/* ══ RIGHT PANEL ══ */}
        <div className="login-right">
          <div className="login-form-wrap">
            {/* Mobile brand */}
            <div className="login-mobile-brand">
              <div className="login-mobile-mark">
                <Shield size={16} color="#fff" />
              </div>
              <span className="login-mobile-name">
                Chanda<span>Baz</span>
              </span>
            </div>

            {/* Heading */}
            <div className="login-form-heading">
              <div className="login-form-eyebrow">Sign In</div>
              <h1 className="login-form-h1">Welcome back</h1>
              <p className="login-form-sub">
                Sign in to your account to continue
              </p>
            </div>

            {/* Card */}
            <div className="login-card">
              <form onSubmit={handleSubmit}>
                {/* Email / Phone */}
                <div className="login-field">
                  <label className="login-label">Email or Phone</label>
                  <input
                    type="text"
                    className="login-input"
                    placeholder="you@example.com or 01700000000"
                    value={form.emailOrPhone}
                    onChange={(e) =>
                      setForm({ ...form, emailOrPhone: e.target.value })
                    }
                    required
                    autoFocus
                  />
                </div>

                {/* Password */}
                <div className="login-field">
                  <label className="login-label">Password</label>
                  <div className="login-pw-wrap">
                    <input
                      type={showPw ? "text" : "password"}
                      className="login-input"
                      style={{ paddingRight: 42 }}
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      required
                    />
                    <button
                      type="button"
                      className="login-pw-toggle"
                      onClick={() => setShowPw(!showPw)}
                    >
                      {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="login-submit"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" /> Signing in…
                    </>
                  ) : (
                    <>
                      <LogIn size={15} /> Sign In
                    </>
                  )}
                </button>
              </form>

              <div className="login-card-footer">
                <p>
                  Don&rsquo;t have an account?{" "}
                  <Link to="/register">
                    Create one free{" "}
                    <ArrowRight
                      size={11}
                      style={{ display: "inline", verticalAlign: "middle" }}
                    />
                  </Link>
                </p>
              </div>
            </div>

            <p className="login-fine">
              By signing in you agree to our terms of service and privacy
              policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
