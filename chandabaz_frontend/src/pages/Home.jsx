import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  Upload,
  TrendingUp,
  FileCheck,
  Users,
  Lock,
  CheckCircle,
  ChevronRight,
  MapPin,
  AlertTriangle,
  Camera,
  Scale,
  Zap,
  Star,
  Globe,
  Shield,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import PostCard from "../components/PostCard";
import FilterBar from "../components/FilterBar";
import LoadingSpinner from "../components/LoadingSpinner";

const INITIAL_FILTERS = {
  search: "",
  location: "",
  mediaType: "",
  startDate: "",
  endDate: "",
};

/* ─── Inline styles ─── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --ink:    #0A0F0D;
    --pine:   #016934;
    --jade:   #019145;
    --mint:   #2DB870;
    --sage:   #A8D4B8;
    --cream:  #F7F5F0;
    --pearl:  #FAFAF8;
    --line:   rgba(1,145,69,0.10);
    --line-light: rgba(255,255,255,0.09);
  }

  .home-root * { box-sizing: border-box; }
  .home-root { font-family: 'DM Sans', sans-serif; color: var(--ink); }

  /* ── Typography ── */
  .display { font-family: 'Playfair Display', Georgia, serif; }

  /* ── Hero ── */
  .hero-section {
    background: var(--ink);
    position: relative;
    overflow: hidden;
  }
  .hero-noise {
    position: absolute; inset: 0; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
    opacity: 0.035;
  }
  .hero-rule {
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(1,145,69,0.65), transparent);
  }
  .hero-glow-a {
    position: absolute; top: -20%; right: -5%; width: 640px; height: 640px;
    background: radial-gradient(circle, rgba(1,145,69,0.22) 0%, transparent 65%);
    filter: blur(90px); pointer-events: none;
  }
  .hero-glow-b {
    position: absolute; bottom: 0; left: -10%; width: 480px; height: 480px;
    background: radial-gradient(circle, rgba(1,145,69,0.12) 0%, transparent 65%);
    filter: blur(70px); pointer-events: none;
  }

  /* ── Hero badge ── */
  .hero-badge {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 8px 16px; border-radius: 100px;
    border: 1px solid var(--line-light);
    background: rgba(255,255,255,0.04);
    backdrop-filter: blur(12px);
    margin-bottom: 36px;
  }
  .hero-badge-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #019145; box-shadow: 0 0 8px #019145;
    animation: pulse-dot 2s infinite;
  }
  @keyframes pulse-dot {
    0%,100% { opacity:1; transform:scale(1); }
    50% { opacity:0.6; transform:scale(0.8); }
  }

  /* ── Hero headline ── */
  .hero-h1 {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(3rem, 7vw, 5.5rem);
    font-weight: 900; line-height: 1.0;
    letter-spacing: -0.02em; color: #fff;
    margin: 0 0 28px;
  }
  .hero-h1 .accent {
    background: linear-gradient(135deg, #5ddc9a 0%, #019145 60%, #016934 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* ── Buttons ── */
  .btn-primary-hero {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 14px 28px; border-radius: 4px;
    background: #019145; color: #fff;
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
    letter-spacing: 0.04em; text-transform: uppercase;
    border: none; cursor: pointer; text-decoration: none;
    transition: background 0.2s, transform 0.2s;
    box-shadow: 0 0 0 1px rgba(255,255,255,0.06), 0 8px 32px rgba(1,145,69,0.35);
  }
  .btn-primary-hero:hover { background: #2DB870; transform: translateY(-1px); }

  .btn-ghost-hero {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 13px 28px; border-radius: 4px;
    background: transparent; color: rgba(255,255,255,0.75);
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
    letter-spacing: 0.04em; text-transform: uppercase;
    border: 1px solid rgba(255,255,255,0.14); cursor: pointer; text-decoration: none;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
  }
  .btn-ghost-hero:hover { border-color: #019145; color: #fff; background: rgba(1,145,69,0.08); }

  /* ── Trust items ── */
  .trust-row { display: flex; flex-wrap: wrap; gap: 20px; margin-top: 32px; }
  .trust-item {
    display: inline-flex; align-items: center; gap: 7px;
    font-size: 12px; color: rgba(255,255,255,0.42); letter-spacing: 0.02em;
  }
  .trust-item svg { color: #019145; flex-shrink: 0; }

  /* ── Dashboard panel (right col) ── */
  .dash-panel {
    border: 1px solid rgba(255,255,255,0.07);
    background: rgba(255,255,255,0.025);
    backdrop-filter: blur(20px);
    border-radius: 6px;
    padding: 28px;
  }
  .dash-panel-header {
    display: flex; align-items: center; justify-content: space-between;
    padding-bottom: 18px; border-bottom: 1px solid rgba(255,255,255,0.07);
    margin-bottom: 20px;
  }
  .dash-panel-title { font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.5); letter-spacing: 0.12em; text-transform: uppercase; }
  .dash-live-dot { display: flex; align-items: center; gap: 6px; font-size: 11px; color: #019145; font-weight: 600; }
  .dash-live-dot::before {
    content:''; width:6px; height:6px; border-radius:50%; background: #019145;
    box-shadow: 0 0 6px #019145; animation: pulse-dot 2s infinite;
  }

  .dash-metric {
    padding: 14px 16px; border-radius: 4px;
    border: 1px solid rgba(255,255,255,0.06);
    background: rgba(0,0,0,0.15);
  }
  .dash-metric-value { font-size: 22px; font-weight: 700; color: #fff; line-height: 1; margin-bottom: 4px; font-family: 'Playfair Display', serif; }
  .dash-metric-label { font-size: 10px; color: rgba(255,255,255,0.35); letter-spacing: 0.08em; text-transform: uppercase; }

  .dash-identity {
    padding: 14px 16px; border-radius: 4px;
    border: 1px solid rgba(251,191,36,0.15);
    background: rgba(251,191,36,0.04);
    display: flex; align-items: center; gap: 12px;
  }
  .dash-identity-icon {
    width: 36px; height: 36px; border-radius: 4px; flex-shrink: 0;
    background: rgba(251,191,36,0.12); border: 1px solid rgba(251,191,36,0.2);
    display: flex; align-items: center; justify-content: center;
  }

  /* ── Section shared ── */
  .section-label {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 10px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase;
    color: #019145; margin-bottom: 14px;
  }
  .section-label::before, .section-label::after {
    content: ''; display: block; width: 20px; height: 1px; background: #019145; opacity: 0.4;
  }
  .section-h2 {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(1.8rem, 3.5vw, 2.75rem);
    font-weight: 800; line-height: 1.1; letter-spacing: -0.02em;
    color: var(--ink); margin: 0;
  }

  /* ── Stats bar ── */
  .stats-bar { background: var(--cream); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
  .stat-item {
    display: flex; align-items: center; gap: 16px;
    padding: 28px 0;
  }
  .stat-icon-wrap {
    width: 44px; height: 44px; border-radius: 4px; flex-shrink: 0;
    background: var(--ink); display: flex; align-items: center; justify-content: center;
  }
  .stat-value {
    font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 800; color: var(--ink); line-height: 1;
  }
  .stat-label { font-size: 11px; color: #7A8A82; letter-spacing: 0.06em; text-transform: uppercase; margin-top: 3px; }
  .stat-divider { width: 1px; height: 44px; background: var(--line); flex-shrink: 0; }

  /* ── Features ── */
  .features-section { background: var(--pearl); }
  .feature-card {
    padding: 32px; border: 1px solid var(--line);
    background: #fff; border-radius: 2px;
    transition: box-shadow 0.25s, transform 0.25s;
    position: relative;
  }
  .feature-card::before {
    content: ''; position: absolute; top: 0; left: 0; width: 3px; height: 0;
    background: #019145; transition: height 0.3s;
  }
  .feature-card:hover { box-shadow: 0 8px 40px rgba(0,0,0,0.08); transform: translateY(-3px); }
  .feature-card:hover::before { height: 100%; }
  .feature-icon-wrap {
    width: 48px; height: 48px; border-radius: 4px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 20px;
  }
  .feature-title { font-size: 15px; font-weight: 700; color: var(--ink); margin: 0 0 8px; }
  .feature-desc { font-size: 13px; color: #6B7B73; line-height: 1.7; margin: 0; }

  /* ── How it works ── */
  .how-section { background: #fff; }
  .step-num {
    font-family: 'Playfair Display', serif;
    font-size: 80px; font-weight: 900; line-height: 1;
    color: var(--cream); user-select: none; margin-bottom: -16px;
    transition: color 0.3s;
  }
  .step-card { padding: 32px; border: 1px solid var(--line); border-radius: 2px; background: var(--pearl); position: relative; overflow: hidden; }
  .step-card:hover .step-num { color: rgba(1,103,56,0.08); }
  .step-connector {
    position: absolute; top: 50%; right: -1px; width: 32px; height: 1px;
    background: linear-gradient(90deg, var(--line), transparent);
    display: none;
  }

  /* ── Testimonials ── */
  .testimonials-section {
    background: var(--ink);
    position: relative; overflow: hidden;
  }
  .testimonials-section::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(1,145,69,0.5), transparent);
  }
  .testimonial-card {
    padding: 32px; border: 1px solid rgba(255,255,255,0.07);
    background: rgba(255,255,255,0.03);
    border-radius: 2px; display: flex; flex-direction: column; gap: 20px;
    transition: background 0.25s, border-color 0.25s;
  }
  .testimonial-card:hover {
    background: rgba(255,255,255,0.05); border-color: rgba(1,145,69,0.25);
  }
  .testimonial-quote { font-size: 13px; color: rgba(255,255,255,0.62); line-height: 1.8; flex: 1; font-style: italic; margin: 0; }
  .testimonial-stars { display: flex; gap: 3px; }
  .testimonial-author { font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.85); margin: 0; }
  .testimonial-loc { font-size: 11px; color: rgba(255,255,255,0.35); display: flex; align-items: center; gap: 4px; margin: 2px 0 0; }
  .testimonial-divider { border: none; border-top: 1px solid rgba(255,255,255,0.07); margin: 0; }

  /* ── Reports feed ── */
  .reports-section { background: var(--pearl); }
  .load-more-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 13px 32px; border-radius: 4px;
    background: transparent; color: #019145;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase;
    border: 1px solid #019145; cursor: pointer;
    transition: background 0.2s, color 0.2s;
  }
  .load-more-btn:hover { background: #019145; color: #fff; }
  .load-more-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* ── CTA banner ── */
  .cta-section {
    background: #019145;
    position: relative; overflow: hidden;
  }
  .cta-section::before {
    content: '';
    position: absolute; inset: 0;
    background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 48px 48px;
  }
  .btn-primary-cta {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 14px 28px; border-radius: 4px;
    background: #fff; color: #019145;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase;
    border: none; cursor: pointer; text-decoration: none;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  }
  .btn-primary-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.2); }
  .btn-ghost-cta {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 13px 28px; border-radius: 4px;
    background: transparent; color: rgba(255,255,255,0.85);
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase;
    border: 1px solid rgba(255,255,255,0.35); cursor: pointer; text-decoration: none;
    transition: background 0.2s, color 0.2s, border-color 0.2s;
  }
  .btn-ghost-cta:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.6); color: #fff; }

  /* ── Submit btn ── */
  .btn-submit {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 20px; border-radius: 3px;
    background: #019145; color: #fff;
    font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
    border: none; cursor: pointer; text-decoration: none;
    transition: background 0.2s;
  }
  .btn-submit:hover { background: #016934; }

  /* ── How CTA btn ── */
  .btn-how-cta {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 14px 32px; border-radius: 4px;
    background: var(--ink); color: #fff;
    font-size: 13px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
    border: none; cursor: pointer; text-decoration: none;
    transition: background 0.2s, transform 0.2s;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  }
  .btn-how-cta:hover { background: #019145; transform: translateY(-1px); }

  /* ── Layout helpers ── */
  .container { max-width: 1280px; margin: 0 auto; padding: 0 32px; }
  @media (max-width: 640px) { .container { padding: 0 20px; } }
  .grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 0; }
  .grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }
  .grid-6 { display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; background: var(--line); border: 1px solid var(--line); }
  .grid-6 > * { background: #fff; }
  .grid-posts { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
  @media (max-width:1200px) { .grid-posts { grid-template-columns: repeat(3,1fr); } }
  @media (max-width:900px) { .grid-posts { grid-template-columns: repeat(2,1fr); } .grid-6 { grid-template-columns: repeat(2,1fr); } .grid-3 { grid-template-columns: 1fr; } .grid-4 { grid-template-columns: repeat(2,1fr); } }
  @media (max-width:640px) { .grid-posts { grid-template-columns: 1fr; } .grid-6 { grid-template-columns: 1fr; } .grid-4 { grid-template-columns: repeat(2,1fr); } }

  .hero-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 64px; align-items: center; }
  @media (max-width:900px) { .hero-grid { grid-template-columns: 1fr; } .hero-right { display: none !important; } }
`;

/* ─── Sub-components ─── */
function StatItem({ value, label, icon: Icon }) {
  return (
    <div
      className="stat-item"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "28px 24px",
      }}
    >
      <div className="stat-icon-wrap">
        <Icon size={18} color="#019145" />
      </div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, bg, fg }) {
  return (
    <div className="feature-card">
      <div className="feature-icon-wrap" style={{ background: bg }}>
        <Icon size={20} color={fg} />
      </div>
      <p className="feature-title">{title}</p>
      <p className="feature-desc">{description}</p>
    </div>
  );
}

function StepCard({ step, icon: Icon, title, description }) {
  return (
    <div className="step-card">
      <div className="step-num">{String(step).padStart(2, "0")}</div>
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 4,
          background: "var(--ink)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 16,
        }}
      >
        <Icon size={20} color="#019145" />
      </div>
      <h3
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 15,
          fontWeight: 700,
          color: "var(--ink)",
          margin: "0 0 8px",
        }}
      >
        {title}
      </h3>
      <p style={{ fontSize: 13, color: "#6B7B73", lineHeight: 1.7, margin: 0 }}>
        {description}
      </p>
    </div>
  );
}

function TestimonialCard({ quote, author, location: loc }) {
  return (
    <div className="testimonial-card">
      <div className="testimonial-stars">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={12} fill="#019145" color="#019145" />
        ))}
      </div>
      <p className="testimonial-quote">&ldquo;{quote}&rdquo;</p>
      <hr className="testimonial-divider" />
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "rgba(1,145,69,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Users size={14} color="#019145" />
        </div>
        <div>
          <p className="testimonial-author">{author}</p>
          <p className="testimonial-loc">
            <MapPin size={10} />
            {loc}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Main export ─── */

const FEATURES = [
  {
    icon: Camera,
    title: "Multi-Media Evidence",
    description:
      "Upload photos, videos, and PDFs. Up to 5 files per report, 50MB each.",
    bg: "rgba(1,145,69,0.08)",
    fg: "#019145",
  },
  {
    icon: Lock,
    title: "Anonymous Reporting",
    description:
      "Submit with complete anonymity. Your name is never shown when you choose anonymous.",
    bg: "rgba(251,191,36,0.10)",
    fg: "#B45309",
  },
  {
    icon: FileCheck,
    title: "Verified Before Publishing",
    description:
      "Every report is reviewed by our team before publishing. Quality guaranteed.",
    bg: "rgba(14,165,233,0.10)",
    fg: "#0369A1",
  },
  {
    icon: Scale,
    title: "Permanent Public Record",
    description:
      "Approved reports are permanent. Evidence can't be silenced once it's published.",
    bg: "rgba(139,92,246,0.10)",
    fg: "#7C3AED",
  },
  {
    icon: Globe,
    title: "Nationwide Coverage",
    description:
      "Reports from any city in Bangladesh. Filter by location, date range, or media type.",
    bg: "rgba(20,184,166,0.10)",
    fg: "#0F766E",
  },
  {
    icon: Users,
    title: "Community Comments",
    description:
      "Citizens can add context and corroborate reports through a moderated comment system.",
    bg: "rgba(239,68,68,0.10)",
    fg: "#DC2626",
  },
];

const STEPS = [
  {
    step: 1,
    icon: Upload,
    title: "Submit Evidence",
    description:
      "Fill in incident details and upload media. Choose to stay anonymous if needed.",
  },
  {
    step: 2,
    icon: FileCheck,
    title: "Admin Verification",
    description:
      "Our team reviews every submission for accuracy and compliance within 24 hours.",
  },
  {
    step: 3,
    icon: Eye,
    title: "Goes Live Publicly",
    description:
      "Approved reports are published to the public feed, searchable nationwide.",
  },
];

export default function Home() {
  const { isLoggedIn } = useAuth();
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [page, setPage] = useState(1);

  const fetchPosts = useCallback(async (cf, cp, append = false) => {
    try {
      const params = new URLSearchParams({ page: cp, limit: 12 });
      if (cf.search) params.set("search", cf.search);
      if (cf.location) params.set("location", cf.location);
      if (cf.mediaType) params.set("mediaType", cf.mediaType);
      if (cf.startDate) params.set("startDate", cf.startDate);
      if (cf.endDate) params.set("endDate", cf.endDate);
      const { data } = await api.get(`/posts?${params}`);
      setPosts((prev) => (append ? [...prev, ...data.data] : data.data));
      setPagination(data.pagination);
    } catch (_) {
      /* silently ignore */
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    setPage(1);
    fetchPosts(filters, 1, false);
  }, [filters, fetchPosts]);

  const handleLoadMore = () => {
    const n = page + 1;
    setPage(n);
    setLoadingMore(true);
    fetchPosts(filters, n, true);
  };
  const hasMore = pagination && pagination.page < pagination.pages;

  return (
    <div className="home-root">
      <style>{css}</style>

      {/* ══ HERO ══ */}
      <section className="hero-section">
        <div className="hero-noise" />
        <div className="hero-rule" />
        <div className="hero-glow-a" />
        <div className="hero-glow-b" />

        <div
          className="container"
          style={{
            position: "relative",
            zIndex: 10,
            paddingTop: 80,
            paddingBottom: 100,
          }}
        >
          <div className="hero-grid">
            {/* Left */}
            <div>
              {/* Badge */}
              <div className="hero-badge">
                {/* BD flag */}
                <div
                  style={{
                    width: 22,
                    height: 14,
                    borderRadius: 2,
                    overflow: "hidden",
                    flexShrink: 0,
                    boxShadow: "0 0 0 1px rgba(255,255,255,0.1)",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "#006A4E",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "45%",
                      transform: "translate(-50%,-50%)",
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#F42A41",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "rgba(168,205,184,0.9)",
                  }}
                >
                  Bangladesh&rsquo;s Transparency Platform
                </span>
                <div className="hero-badge-dot" />
              </div>

              {/* Headline */}
              <h1 className="hero-h1">
                Real Evidence.
                <br />
                <span className="accent">Real Change.</span>
                <br />
                Expose Corruption.
              </h1>

              <p
                style={{
                  fontSize: 15,
                  lineHeight: 1.8,
                  color: "rgba(187,226,209,0.65)",
                  margin: "0 0 36px",
                  maxWidth: 500,
                }}
              >
                Bangladesh&rsquo;s citizen-powered platform to document and
                publish verified evidence of public corruption. Every report is
                reviewed before going live.{" "}
                <strong style={{ color: "#fff", fontWeight: 600 }}>
                  Your identity is always protected.
                </strong>
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                <a href="#reports" className="btn-primary-hero">
                  <Eye size={16} /> View Reports <ChevronRight size={15} />
                </a>
                {isLoggedIn ? (
                  <Link to="/submit" className="btn-ghost-hero">
                    <Upload size={16} /> Submit Evidence
                  </Link>
                ) : (
                  <Link to="/register" className="btn-ghost-hero">
                    Get Started Free <ArrowRight size={16} />
                  </Link>
                )}
              </div>

              <div className="trust-row">
                <span className="trust-item">
                  <CheckCircle size={12} />
                  No account needed to browse
                </span>
                <span className="trust-item">
                  <Lock size={12} />
                  100% anonymous option
                </span>
                <span className="trust-item">
                  <Shield size={12} />
                  Expert-reviewed reports
                </span>
              </div>
            </div>

            {/* Right — dashboard panel */}
            <div className="hero-right" style={{ position: "relative" }}>
              {/* ambient */}
              <div
                style={{
                  position: "absolute",
                  inset: "-40px",
                  background:
                    "radial-gradient(ellipse, rgba(56,180,126,0.07) 0%, transparent 65%)",
                  filter: "blur(20px)",
                  pointerEvents: "none",
                }}
              />
              <div className="dash-panel" style={{ position: "relative" }}>
                <div className="dash-panel-header">
                  <span className="dash-panel-title">
                    Transparency Snapshot
                  </span>
                  <span className="dash-live-dot">Live</span>
                </div>

                {/* metrics */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3,1fr)",
                    gap: 10,
                    marginBottom: 12,
                  }}
                >
                  {[
                    {
                      icon: AlertTriangle,
                      value: "500+",
                      label: "Reports Filed",
                      c: "rgba(251,191,36,0.3)",
                    },
                    {
                      icon: Zap,
                      value: "<24h",
                      label: "Avg Review",
                      c: "rgba(1,145,69,0.45)",
                    },
                    {
                      icon: Globe,
                      value: "12+",
                      label: "Cities Covered",
                      c: "rgba(125,211,252,0.25)",
                    },
                  ].map(({ icon: Icon, value, label, c }) => (
                    <div key={label} className="dash-metric">
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 4,
                          background: c,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: 8,
                        }}
                      >
                        <Icon size={13} color="#fff" />
                      </div>
                      <div className="dash-metric-value">{value}</div>
                      <div className="dash-metric-label">{label}</div>
                    </div>
                  ))}
                </div>

                {/* identity bar */}
                <div className="dash-identity" style={{ marginBottom: 12 }}>
                  <div className="dash-identity-icon">
                    <Lock size={14} color="rgba(251,191,36,0.9)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "rgba(255,255,255,0.85)",
                        margin: 0,
                      }}
                    >
                      Identity 100% Protected
                    </p>
                    <p
                      style={{
                        fontSize: 11,
                        color: "rgba(255,255,255,0.35)",
                        margin: "2px 0 0",
                      }}
                    >
                      Anonymous mode for every report
                    </p>
                  </div>
                  <CheckCircle size={16} color="#019145" />
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 10,
                  }}
                >
                  {[
                    { label: "Verification", value: "Manual + Media Review" },
                    { label: "Visibility", value: "Public & Searchable" },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      style={{
                        borderRadius: 4,
                        border: "1px solid rgba(255,255,255,0.06)",
                        background: "rgba(0,0,0,0.15)",
                        padding: "10px 12px",
                      }}
                    >
                      <p
                        style={{
                          fontSize: 10,
                          color: "rgba(255,255,255,0.35)",
                          margin: "0 0 3px",
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                        }}
                      >
                        {label}
                      </p>
                      <p
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "rgba(255,255,255,0.8)",
                          margin: 0,
                        }}
                      >
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* fade out */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 80,
            background: "linear-gradient(to bottom, transparent, var(--cream))",
            pointerEvents: "none",
          }}
        />
      </section>

      {/* ══ STATS BAR ══ */}
      <section className="stats-bar">
        <div className="container">
          <div
            className="grid-4"
            style={{ borderLeft: "1px solid var(--line)" }}
          >
            {[
              { value: "500+", label: "Reports submitted", icon: FileCheck },
              { value: "100%", label: "Anonymous option", icon: Lock },
              { value: "24hr", label: "Review turnaround", icon: Zap },
              { value: "12+", label: "Cities covered", icon: MapPin },
            ].map((s, i) => (
              <div
                key={s.label}
                style={{ borderRight: "1px solid var(--line)" }}
              >
                <StatItem {...s} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURES ══ */}
      <section className="features-section" style={{ padding: "96px 0" }}>
        <div className="container">
          <div style={{ marginBottom: 56 }}>
            <div className="section-label">Why ChandaBaz</div>
            <h2 className="section-h2" style={{ marginBottom: 14 }}>
              Built for truth.
              <br />
              Designed for trust.
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "#6B7B73",
                maxWidth: 480,
                lineHeight: 1.8,
                margin: 0,
              }}
            >
              Every feature is designed to make reporting safe, easy, and
              impactful for Bangladeshi citizens.
            </p>
          </div>
          <div className="grid-6">
            {FEATURES.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className="how-section" style={{ padding: "96px 0" }}>
        <div className="container">
          <div style={{ marginBottom: 56 }}>
            <div className="section-label">Simple Process</div>
            <h2 className="section-h2" style={{ marginBottom: 14 }}>
              How ChandaBaz works
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "#6B7B73",
                maxWidth: 440,
                lineHeight: 1.8,
                margin: 0,
              }}
            >
              From witnessing corruption to making it public — our 3-step
              process is fast, secure, and effective.
            </p>
          </div>
          <div className="grid-3">
            {STEPS.map((s) => (
              <StepCard key={s.step} {...s} />
            ))}
          </div>
          <div style={{ marginTop: 48 }}>
            <Link
              to={isLoggedIn ? "/submit" : "/register"}
              className="btn-how-cta"
            >
              {isLoggedIn ? (
                <>
                  <Upload size={16} /> Submit a Report
                </>
              ) : (
                <>
                  <ArrowRight size={16} /> Start Reporting for Free
                </>
              )}
            </Link>
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section className="testimonials-section" style={{ padding: "96px 0" }}>
        <div className="container">
          <div
            style={{
              marginBottom: 52,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 20,
            }}
          >
            <div>
              <div className="section-label" style={{ color: "var(--mint)" }}>
                <span
                  style={{
                    background: "var(--mint)",
                    opacity: 0.4,
                    display: "block",
                    width: 20,
                    height: 1,
                    marginRight: 6,
                  }}
                />
                Community Voices
                <span
                  style={{
                    background: "var(--mint)",
                    opacity: 0.4,
                    display: "block",
                    width: 20,
                    height: 1,
                    marginLeft: 6,
                  }}
                />
              </div>
              <h2 className="section-h2 display" style={{ color: "#fff" }}>
                Trusted by citizens
                <br />
                across Bangladesh
              </h2>
            </div>
          </div>
          <div className="grid-3">
            <TestimonialCard
              quote="I submitted a report about a corrupt official anonymously. It was approved within hours and got thousands of views. Real change starts with evidence."
              author="Concerned Citizen"
              location="Dhaka, Dhaka"
            />
            <TestimonialCard
              quote="Incredibly easy to use. I uploaded video evidence from my phone and within a day it was live. This is how accountability should work in Bangladesh."
              author="Civil Society Member"
              location="Chittagong, Chattogram"
            />
            <TestimonialCard
              quote="ChandaBaz gave me the courage to speak up. The anonymous option meant I could report without fear. More people need to know about this platform."
              author="Anonymous Reporter"
              location="Sylhet"
            />
          </div>
        </div>
      </section>

      {/* ══ REPORTS FEED ══ */}
      <section
        id="reports"
        className="reports-section"
        style={{ padding: "80px 0" }}
      >
        <div className="container">
          {/* header */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 16,
              marginBottom: 36,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div className="section-label">Public Evidence</div>
              <h2
                className="section-h2"
                style={{
                  fontSize: "clamp(1.5rem,2.5vw,2rem)",
                  marginBottom: 6,
                }}
              >
                Verified Reports
              </h2>
              {pagination && (
                <p
                  style={{
                    fontSize: 12,
                    color: "#7A8A82",
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <TrendingUp size={12} color="#019145" />
                  {pagination.total} verified reports &middot; Latest first
                </p>
              )}
            </div>
            {isLoggedIn && (
              <Link to="/submit" className="btn-submit">
                <Upload size={14} /> Submit Report
              </Link>
            )}
          </div>

          {/* filters */}
          <div style={{ marginBottom: 32 }}>
            <FilterBar
              filters={filters}
              onChange={setFilters}
              onClear={() => setFilters(INITIAL_FILTERS)}
            />
          </div>

          {/* states */}
          {loading ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "80px 0",
                gap: 16,
              }}
            >
              <LoadingSpinner size="lg" />
              <p style={{ fontSize: 13, color: "#7A8A82" }}>Loading reports…</p>
            </div>
          ) : posts.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "80px 0",
                gap: 20,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  border: "1px solid var(--line)",
                  borderRadius: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Eye size={28} color="#019145" style={{ opacity: 0.4 }} />
              </div>
              <div>
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "var(--ink)",
                    margin: "0 0 6px",
                  }}
                >
                  No reports found
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: "#7A8A82",
                    maxWidth: 340,
                    margin: 0,
                  }}
                >
                  {Object.values(filters).some(Boolean)
                    ? "Try adjusting your search filters."
                    : "Be the first to submit evidence of corruption."}
                </p>
              </div>
              {isLoggedIn ? (
                <Link
                  to="/submit"
                  className="btn-submit"
                  style={{ marginTop: 8 }}
                >
                  <Upload size={14} /> Submit First Report
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="btn-submit"
                  style={{ marginTop: 8 }}
                >
                  <ArrowRight size={14} /> Join &amp; Report
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="grid-posts">
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
              {hasMore && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: 48,
                  }}
                >
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="load-more-btn"
                  >
                    {loadingMore ? (
                      <>
                        <LoadingSpinner size="sm" /> Loading…
                      </>
                    ) : (
                      <>
                        Load More Reports <ChevronRight size={15} />
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ══ FINAL CTA ══ */}
      {!isLoggedIn && (
        <section className="cta-section" style={{ padding: "96px 0" }}>
          <div
            className="container"
            style={{ position: "relative", zIndex: 10, textAlign: "center" }}
          >
            <div
              className="section-label"
              style={{
                justifyContent: "center",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              Take Action
            </div>
            <h2
              className="section-h2 display"
              style={{ color: "#fff", maxWidth: 600, margin: "0 auto 16px" }}
            >
              Witnessed corruption?
              <br />
              Don&rsquo;t stay silent.
            </h2>
            <p
              style={{
                fontSize: 15,
                color: "rgba(255,255,255,0.65)",
                maxWidth: 440,
                margin: "0 auto 40px",
                lineHeight: 1.8,
              }}
            >
              Create a free account and submit your evidence today. Anonymous
              reporting is fully supported.
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 14,
                justifyContent: "center",
              }}
            >
              <Link to="/register" className="btn-primary-cta">
                <Upload size={16} /> Create Free Account
              </Link>
              <a href="#reports" className="btn-ghost-cta">
                <Eye size={16} /> Browse Reports First
              </a>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
