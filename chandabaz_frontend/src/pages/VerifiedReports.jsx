import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  Upload,
  TrendingUp,
  ChevronRight,
  ArrowRight,
  CheckCircle,
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

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');

  .vr-root * { box-sizing: border-box; }
  .vr-root { font-family: 'DM Sans', sans-serif; color: #0A0F0D; background: #FAFAF8; min-height: 100vh; }

  .vr-container { max-width: 1280px; margin: 0 auto; padding: 0 32px; }
  @media (max-width: 640px) { .vr-container { padding: 0 20px; } }

  /* ── Page header ── */
  .vr-header {
    background: #0A0F0D;
    padding: 64px 0 52px;
    position: relative;
    overflow: hidden;
  }
  .vr-header-noise {
    position: absolute; inset: 0; pointer-events: none; opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 200px 200px;
  }
  .vr-header-glow {
    position: absolute; top: -80px; right: -100px; width: 500px; height: 500px;
    background: radial-gradient(ellipse, rgba(1,145,69,0.08) 0%, transparent 65%);
    filter: blur(40px); pointer-events: none;
  }
  .vr-header-label {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 10px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase;
    color: rgba(168,212,184,0.70);
    margin-bottom: 16px;
  }
  .vr-header-label::before {
    content: ''; display: block; width: 20px; height: 1px;
    background: rgba(168,212,184,0.35);
  }
  .vr-header h1 {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 800; color: #fff;
    margin: 0 0 14px; letter-spacing: -0.02em; line-height: 1.15;
  }
  .vr-header h1 span { color: #019145; }
  .vr-header-sub {
    font-size: 14px; color: rgba(187,226,209,0.60);
    margin: 0; max-width: 520px; line-height: 1.8;
  }

  /* ── Verified badge ── */
  .vr-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(1,145,69,0.10); border: 1px solid rgba(1,145,69,0.18);
    padding: 5px 12px; border-radius: 2px;
    font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
    color: #019145;
  }

  /* ── Main content ── */
  .vr-main { padding: 48px 0 88px; }

  .vr-topbar {
    display: flex; align-items: center; justify-content: space-between;
    gap: 16px; flex-wrap: wrap; margin-bottom: 28px;
  }
  .vr-count {
    font-size: 13px; color: #7A8A82;
    display: inline-flex; align-items: center; gap: 6px;
  }

  /* Submit btn */
  .vr-btn-submit {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 10px 20px; border-radius: 2px;
    background: #019145; color: #fff;
    font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase;
    border: none; cursor: pointer; text-decoration: none;
    transition: background 0.2s, transform 0.15s;
    box-shadow: 0 2px 12px rgba(1,145,69,0.20);
  }
  .vr-btn-submit:hover { background: #016934; transform: translateY(-1px); }

  /* ── Grid ── */
  .vr-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
    margin-bottom: 40px;
  }
  @media (max-width: 640px) { .vr-grid { grid-template-columns: 1fr; } }

  /* Load more */
  .vr-load-more {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 13px 32px; border-radius: 2px;
    background: transparent; color: #019145;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase;
    border: 1px solid #019145; cursor: pointer;
    transition: background 0.2s, color 0.2s;
  }
  .vr-load-more:hover:not(:disabled) { background: #019145; color: #fff; }
  .vr-load-more:disabled { opacity: 0.5; cursor: not-allowed; }

  /* Empty state */
  .vr-empty {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 80px 0; gap: 20px; text-align: center;
  }
  .vr-empty-icon {
    width: 72px; height: 72px;
    border: 1px solid rgba(1,145,69,0.12); border-radius: 4px;
    display: flex; align-items: center; justify-content: center;
  }
`;

export default function VerifiedReports() {
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
    <div className="vr-root">
      <style>{css}</style>

      {/* ── Page Header ── */}
      <section className="vr-header">
        <div className="vr-header-noise" />
        <div className="vr-header-glow" />
        <div className="vr-container" style={{ position: "relative", zIndex: 10 }}>
          <div className="vr-header-label">Public Evidence</div>
          <h1>
            Verified <span>Reports</span>
          </h1>
          <p className="vr-header-sub">
            Browse all verified, admin-approved corruption reports submitted by
            citizens across Bangladesh.
          </p>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="vr-main">
        <div className="vr-container">

          {/* Top bar */}
          <div className="vr-topbar">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="vr-badge">
                <CheckCircle size={11} /> Verified &amp; Approved
              </div>
              {pagination && (
                <span className="vr-count">
                  <TrendingUp size={12} color="#019145" />
                  {pagination.total} reports &middot; Latest first
                </span>
              )}
            </div>
            {isLoggedIn && (
              <Link to="/submit" className="vr-btn-submit">
                <Upload size={14} /> Submit Report
              </Link>
            )}
          </div>

          {/* Filters */}
          <div style={{ marginBottom: 32 }}>
            <FilterBar
              filters={filters}
              onChange={setFilters}
              onClear={() => setFilters(INITIAL_FILTERS)}
            />
          </div>

          {/* States */}
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
              <p style={{ fontSize: 13, color: "#7A8A82" }}>
                Loading reports…
              </p>
            </div>
          ) : posts.length === 0 ? (
            <div className="vr-empty">
              <div className="vr-empty-icon">
                <Eye size={28} color="#019145" style={{ opacity: 0.4 }} />
              </div>
              <div>
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#0A0F0D",
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
                    : "No verified reports available yet."}
                </p>
              </div>
              {isLoggedIn ? (
                <Link
                  to="/submit"
                  className="vr-btn-submit"
                  style={{ marginTop: 8 }}
                >
                  <Upload size={14} /> Submit First Report
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="vr-btn-submit"
                  style={{ marginTop: 8 }}
                >
                  <ArrowRight size={14} /> Join &amp; Report
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="vr-grid">
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
                    className="vr-load-more"
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
    </div>
  );
}
