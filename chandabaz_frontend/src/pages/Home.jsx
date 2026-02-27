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

function HeroStat({ value, label, icon: Icon }) {
  return (
    <div className="flex items-center gap-3 px-5 py-4 bg-white rounded-2xl border border-neutral-100 shadow-card">
      <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
        <Icon size={18} className="text-primary-600" />
      </div>
      <div>
        <div className="text-xl font-extrabold text-neutral-900 leading-none">
          {value}
        </div>
        <div className="text-xs text-neutral-500 mt-0.5">{label}</div>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, accent }) {
  return (
    <div className="card p-6 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${accent}`}
      >
        <Icon size={22} className="text-white" />
      </div>
      <h3 className="text-base font-bold text-neutral-900 mb-2">{title}</h3>
      <p className="text-sm text-neutral-500 leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({ step, icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center text-center px-4">
      <div className="relative mb-5">
        <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center shadow-md">
          <Icon size={26} className="text-white" />
        </div>
        <div className="absolute -top-2 -right-2 w-7 h-7 bg-neutral-900 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-extrabold">{step}</span>
        </div>
      </div>
      <h3 className="text-base font-bold text-neutral-900 mb-2">{title}</h3>
      <p className="text-sm text-neutral-500 leading-relaxed max-w-xs">
        {description}
      </p>
    </div>
  );
}

function TestimonialCard({ quote, author, location: loc }) {
  return (
    <div className="card p-6 flex flex-col gap-4">
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={14} fill="#016738" className="text-primary-600" />
        ))}
      </div>
      <p className="text-sm text-neutral-700 leading-relaxed flex-1 italic">
        &ldquo;{quote}&rdquo;
      </p>
      <div className="flex items-center gap-2 pt-3 border-t border-neutral-50">
        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
          <Users size={14} className="text-primary-600" />
        </div>
        <div>
          <p className="text-xs font-bold text-neutral-900">{author}</p>
          <p className="text-xs text-neutral-400 flex items-center gap-1">
            <MapPin size={10} />
            {loc}
          </p>
        </div>
      </div>
    </div>
  );
}

function HeroTrustItem({ icon: Icon, text }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs text-emerald-100/70">
      <Icon size={13} className="text-primary-300 flex-shrink-0" />
      {text}
    </span>
  );
}

function HeroMetricCard({ icon: Icon, value, label, tint }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl px-4 py-3">
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: tint }}
        >
          <Icon size={14} className="text-white" />
        </div>
        <p className="text-base font-extrabold text-white leading-none">{value}</p>
      </div>
      <p className="text-[11px] text-white/45">{label}</p>
    </div>
  );
}

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

  const FEATURES = [
    {
      icon: Camera,
      title: "Multi-Media Evidence",
      description:
        "Upload photos, videos, and PDFs. Up to 5 files per report, 50MB each.",
      accent: "bg-primary-600",
    },
    {
      icon: Lock,
      title: "Anonymous Reporting",
      description:
        "Submit with complete anonymity. Your name is never shown when you choose anonymous.",
      accent: "bg-amber-500",
    },
    {
      icon: FileCheck,
      title: "Verified Before Publishing",
      description:
        "Every report is reviewed by our team before publishing. Quality guaranteed.",
      accent: "bg-sky-600",
    },
    {
      icon: Scale,
      title: "Permanent Public Record",
      description:
        "Approved reports are permanent. Evidence can't be silenced once it's published.",
      accent: "bg-purple-600",
    },
    {
      icon: Globe,
      title: "Nationwide Coverage",
      description:
        "Reports from any city in Bangladesh. Filter by location, date range, or media type.",
      accent: "bg-teal-600",
    },
    {
      icon: Users,
      title: "Community Comments",
      description:
        "Citizens can add context and corroborate reports through a moderated comment system.",
      accent: "bg-rose-500",
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

  return (
    <div className="bg-white">
      {/* ══ HERO ══ */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, #010e07 0%, #021810 45%, #020d06 100%)",
        }}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 inset-x-0 h-px pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(56,180,126,0.3) 25%, rgba(56,180,126,0.7) 50%, rgba(56,180,126,0.3) 75%, transparent 100%)",
          }}
        />

        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(56,180,126,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(56,180,126,0.025) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        {/* Glow orbs */}
        <div
          className="absolute -top-[20%] right-[5%] w-[700px] h-[700px] pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(56,180,126,0.10) 0%, transparent 60%)",
            filter: "blur(70px)",
          }}
        />
        <div
          className="absolute bottom-[5%] -left-[5%] w-[500px] h-[500px] pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(1,103,56,0.12) 0%, transparent 60%)",
            filter: "blur(55px)",
          }}
        />
        <div
          className="absolute top-[30%] right-[40%] w-[300px] h-[300px] pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(56,180,126,0.06) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        <div className="container-app relative z-10 py-20 sm:py-24 lg:py-28">
          <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] gap-10 lg:gap-14 items-center">
            {/* Left column */}
            <div className="max-w-2xl">
              {/* Bangladesh badge */}
              <div
                className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full border backdrop-blur-xl mb-8"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  borderColor: "rgba(255,255,255,0.09)",
                  boxShadow: "0 0 30px -8px rgba(56,180,126,0.2)",
                }}
              >
                {/* Bangladesh flag mini */}
                <div
                  className="relative w-6 h-[15px] rounded-[2px] overflow-hidden flex-shrink-0"
                  style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.1)" }}
                >
                  <div className="absolute inset-0 bg-[#006A4E]" />
                  <div className="absolute top-1/2 left-[45%] -translate-x-1/2 -translate-y-1/2 w-[9px] h-[9px] rounded-full bg-[#F42A41]" />
                </div>
                <span
                  className="text-xs font-bold tracking-[0.13em] uppercase"
                  style={{ color: "rgba(187,226,209,0.9)" }}
                >
                  Bangladesh&rsquo;s Transparency Platform
                </span>
                <span className="relative flex h-2 w-2 ml-0.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-400" />
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[72px] font-black leading-[0.95] tracking-tight mb-6">
                <span className="block text-white">Real Evidence.</span>
                <span
                  className="block text-transparent bg-clip-text"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #6ee7b7 0%, #34d399 40%, #059669 100%)",
                  }}
                >
                  Real Change.
                </span>
                <span className="block mt-2 text-white">
                  Expose{" "}
                  <span
                    className="text-transparent bg-clip-text"
                    style={{
                      backgroundImage:
                        "linear-gradient(90deg, #4ade80, #22d3ee)",
                    }}
                  >
                    Corruption.
                  </span>
                </span>
              </h1>

              <p
                className="text-sm sm:text-base lg:text-lg leading-relaxed mb-8 max-w-xl"
                style={{ color: "rgba(187,226,209,0.75)" }}
              >
                Bangladesh&rsquo;s citizen-powered platform to document and
                publish verified evidence of public corruption. Every report is
                reviewed before going live.{" "}
                <strong className="text-white font-semibold">
                  Your identity is always protected.
                </strong>
              </p>

              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 mb-8">
                <a
                  href="#reports"
                  className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-primary-600 text-white text-sm sm:text-base font-bold rounded-2xl hover:bg-primary-500 transition-all duration-300 hover:scale-[1.02]"
                  style={{ boxShadow: "0 0 40px -8px rgba(56,180,126,0.45)" }}
                >
                  <Eye size={19} /> View Reports
                  <ChevronRight
                    size={17}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </a>
                {isLoggedIn ? (
                  <Link
                    to="/submit"
                    className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-white text-sm sm:text-base font-semibold rounded-2xl border border-white/20 hover:bg-white hover:text-primary-800 transition-all duration-300 backdrop-blur-sm"
                    style={{ background: "rgba(255,255,255,0.07)" }}
                  >
                    <Upload size={18} /> Submit Evidence
                  </Link>
                ) : (
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-white text-sm sm:text-base font-semibold rounded-2xl border border-white/20 hover:bg-white hover:text-primary-800 transition-all duration-300 backdrop-blur-sm"
                    style={{ background: "rgba(255,255,255,0.07)" }}
                  >
                    Get Started Free <ArrowRight size={18} />
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 max-w-2xl">
                <HeroTrustItem
                  icon={CheckCircle}
                  text="No account needed to browse"
                />
                <HeroTrustItem icon={Lock} text="100% anonymous option" />
                <HeroTrustItem
                  icon={Shield}
                  text="Expert-reviewed reports"
                />
              </div>
            </div>

            {/* Right — Elite dashboard mockup */}
            <div className="hidden md:block relative">
              {/* Ambient glow */}
              <div
                className="absolute -inset-8 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse, rgba(56,180,126,0.08) 0%, transparent 70%)",
                  filter: "blur(20px)",
                }}
              />

              <div className="relative rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5 lg:p-6 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <p className="text-sm font-semibold text-white/85">
                    Transparency Snapshot
                  </p>
                  <span className="text-[11px] text-primary-300 font-medium">
                    Live Platform
                  </span>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3 gap-3">
                  <HeroMetricCard
                    icon={AlertTriangle}
                    value="500+"
                    label="Reports Filed"
                    tint="rgba(251,191,36,0.32)"
                  />
                  <HeroMetricCard
                    icon={Zap}
                    value="<24h"
                    label="Avg Review"
                    tint="rgba(52,211,153,0.34)"
                  />
                  <HeroMetricCard
                    icon={Globe}
                    value="12+"
                    label="Cities Covered"
                    tint="rgba(125,211,252,0.28)"
                  />
                </div>

                {/* Identity protection bar */}
                <div className="rounded-2xl border border-white/10 flex items-center gap-3 px-4 py-3 backdrop-blur-xl bg-white/[0.02]">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "rgba(251,191,36,0.1)",
                      border: "1px solid rgba(251,191,36,0.2)",
                    }}
                  >
                    <Lock size={15} style={{ color: "rgba(251,191,36,0.9)" }} />
                  </div>
                  <div className="flex-1">
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "rgba(255,255,255,0.85)" }}
                    >
                      Identity 100% Protected
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "rgba(255,255,255,0.35)" }}
                    >
                      Anonymous mode for every report
                    </p>
                  </div>
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "rgba(52,211,153,0.1)",
                      border: "1px solid rgba(52,211,153,0.2)",
                    }}
                  >
                    <CheckCircle size={15} className="text-emerald-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2.5">
                    <p className="text-xs text-white/45 mb-0.5">Verification</p>
                    <p className="text-sm font-semibold text-white">
                      Manual + Media Review
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2.5">
                    <p className="text-xs text-white/45 mb-0.5">Visibility</p>
                    <p className="text-sm font-semibold text-white">
                      Public and Searchable
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fade to next section */}
        <div
          className="absolute bottom-0 inset-x-0 h-28 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, #FAFAFA 100%)",
            clipPath: "ellipse(130% 100% at 50% 100%)",
          }}
        />
      </section>

      {/* ══ STATS BAR ══ */}
      <section className="py-12 bg-[#FAFAFA] border-b border-neutral-100/50">
        <div className="container-app relative -mt-20 z-30">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            <HeroStat value="500+" label="Reports submitted" icon={FileCheck} />
            <HeroStat value="100%" label="Anonymous option" icon={Lock} />
            <HeroStat value="24hr" label="Review turnaround" icon={Zap} />
            <HeroStat value="12+" label="Cities covered" icon={MapPin} />
          </div>
        </div>
      </section>

      {/* ══ FEATURES ══ */}
      <section className="py-20 lg:py-24 bg-neutral-50">
        <div className="container-app">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-primary-50 text-primary-700 text-xs font-bold rounded-full border border-primary-100 tracking-wider uppercase mb-4">
              Why ChandaBaz
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900">
              Built for truth. Designed for trust.
            </h2>
            <p className="text-neutral-500 mt-4 max-w-2xl mx-auto">
              Every feature is designed to make reporting safe, easy, and
              impactful for Bangladeshi citizens.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="container-app">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-primary-50 text-primary-700 text-xs font-bold rounded-full border border-primary-100 tracking-wider uppercase mb-4">
              Simple Process
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900">
              How ChandaBaz works
            </h2>
            <p className="text-neutral-500 mt-4 max-w-xl mx-auto">
              From witnessing corruption to making it public &mdash; our 3-step
              process is fast, secure, and effective.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-6">
            {STEPS.map((s) => (
              <StepCard key={s.step} {...s} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              to={isLoggedIn ? "/submit" : "/register"}
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-primary-600 text-white text-base font-semibold rounded-2xl hover:bg-primary-700 shadow-md hover:shadow-lg transition-all"
            >
              {isLoggedIn ? (
                <>
                  <Upload size={18} />
                  Submit a Report
                </>
              ) : (
                <>
                  <ArrowRight size={18} />
                  Start Reporting for Free
                </>
              )}
            </Link>
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section className="py-20 lg:py-24 bg-primary-50">
        <div className="container-app">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-primary-100 text-primary-700 text-xs font-bold rounded-full border border-primary-200 tracking-wider uppercase mb-4">
              Community Voices
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900">
              Trusted by citizens across Bangladesh
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
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
      <section id="reports" className="py-16 lg:py-20 bg-white">
        <div className="container-app">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary-700 text-xs font-bold rounded-full border border-primary-100 uppercase tracking-wider mb-3">
                Public Evidence
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
                Verified Reports
              </h2>
              {pagination && (
                <p className="text-sm text-neutral-400 mt-1 flex items-center gap-1.5">
                  <TrendingUp size={13} className="text-primary-500" />
                  {pagination.total} verified reports &middot; Latest first
                </p>
              )}
            </div>
            {isLoggedIn && (
              <Link to="/submit" className="btn-primary flex-shrink-0">
                <Upload size={15} />
                Submit Report
              </Link>
            )}
          </div>

          <div className="mb-8">
            <FilterBar
              filters={filters}
              onChange={setFilters}
              onClear={() => setFilters(INITIAL_FILTERS)}
            />
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-28 gap-4">
              <LoadingSpinner size="lg" />
              <p className="text-sm text-neutral-400">Loading reports...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-28 gap-4 text-center">
              <div className="w-20 h-20 bg-primary-50 rounded-3xl flex items-center justify-center">
                <Eye size={32} className="text-primary-300" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-700 mb-1">
                  No reports found
                </h3>
                <p className="text-sm text-neutral-400 max-w-sm">
                  {Object.values(filters).some(Boolean)
                    ? "Try adjusting your search filters."
                    : "Be the first to submit evidence of corruption."}
                </p>
              </div>
              {isLoggedIn ? (
                <Link to="/submit" className="btn-primary mt-2">
                  <Upload size={15} />
                  Submit First Report
                </Link>
              ) : (
                <Link to="/register" className="btn-primary mt-2">
                  <ArrowRight size={15} />
                  Join &amp; Report
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
              {hasMore && (
                <div className="flex justify-center mt-12">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="btn-secondary-lg"
                  >
                    {loadingMore ? (
                      <>
                        <LoadingSpinner size="sm" />
                        Loading...
                      </>
                    ) : (
                      <>
                        Load More Reports <ChevronRight size={16} />
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
        <section
          className="py-20 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #016738, #014124)" }}
        >
          <div className="absolute inset-0 hero-pattern opacity-10" />
          <div className="container-app relative z-10 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Witnessed corruption? Don&rsquo;t stay silent.
            </h2>
            <p
              className="text-lg mb-8 max-w-xl mx-auto"
              style={{ color: "rgba(209,238,220,0.85)" }}
            >
              Create a free account and submit your evidence today. Anonymous
              reporting is fully supported.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-white text-primary-700 text-base font-semibold rounded-2xl hover:bg-primary-50 shadow-lg transition-all"
              >
                <Upload size={20} />
                Create Free Account
              </Link>
              <a
                href="#reports"
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-white/10 text-white text-base font-semibold rounded-2xl border-2 border-white/30 hover:bg-white hover:text-primary-700 backdrop-blur-sm transition-all"
              >
                <Eye size={18} />
                Browse Reports First
              </a>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
