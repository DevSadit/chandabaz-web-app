import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  MapPin,
  Trash2,
  Eye,
  User,
  Edit3,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import api from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import ConfirmDialog from "../components/ConfirmDialog";
import { useAuth } from "../context/AuthContext";

/* ─── Styles ─── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');

  .ud-root * { box-sizing: border-box; }
  .ud-root { font-family: 'DM Sans', sans-serif; background: #F7F5F0; min-height: 100vh; }

  /* ── Page header ── */
  .ud-header {
    background: #0A0F0D; position: relative; overflow: hidden;
    border-bottom: 1px solid rgba(1,145,69,0.15);
  }
  .ud-header::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(1,145,69,0.55), transparent);
  }
  .ud-header-grid {
    position: absolute; inset: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(1,145,69,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(1,145,69,0.04) 1px, transparent 1px);
    background-size: 48px 48px;
  }
  .ud-header-glow {
    position: absolute; top: -60%; right: -5%; width: 500px; height: 400px;
    background: radial-gradient(circle, rgba(1,145,69,0.14) 0%, transparent 65%);
    filter: blur(60px); pointer-events: none;
  }
  .ud-header-inner {
    max-width: 1280px; margin: 0 auto; padding: 32px 32px;
    position: relative; z-index: 2;
    display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;
  }
  @media (max-width: 640px) { .ud-header-inner { padding: 24px 20px; } }

  .ud-header-left { display: flex; align-items: flex-start; gap: 14px; }
  .ud-header-icon {
    width: 44px; height: 44px; border-radius: 2px; flex-shrink: 0;
    background: #019145;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 20px rgba(1,145,69,0.30);
  }
  .ud-eyebrow {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 9px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase;
    color: #019145; margin-bottom: 6px;
  }
  .ud-eyebrow::before, .ud-eyebrow::after {
    content: ''; display: block; width: 14px; height: 1px; background: #019145; opacity: 0.4;
  }
  .ud-header-h1 {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 22px; font-weight: 800; color: #fff; letter-spacing: -0.02em; margin: 0 0 4px;
  }
  .ud-header-sub { font-size: 12px; color: rgba(255,255,255,0.38); margin: 0; }

  /* Refresh button */
  .ud-btn-refresh {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 9px 18px; border-radius: 2px;
    background: rgba(1,145,69,0.08); border: 1px solid rgba(1,145,69,0.22);
    color: #019145;
    font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
    flex-shrink: 0;
  }
  .ud-btn-refresh:hover { background: rgba(1,145,69,0.14); border-color: rgba(1,145,69,0.40); }
  .ud-btn-refresh:disabled { opacity: 0.45; cursor: not-allowed; }

  /* ── Body ── */
  .ud-body { max-width: 1280px; margin: 0 auto; padding: 32px 32px 64px; }
  @media (max-width: 640px) { .ud-body { padding: 24px 20px 48px; } }

  /* ── Stat cards ── */
  .ud-stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin-bottom: 24px; }
  @media (max-width: 900px) { .ud-stats { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 480px) { .ud-stats { grid-template-columns: 1fr 1fr; } }

  .ud-stat {
    padding: 20px; border-radius: 2px;
    background: #fff; border: 1px solid rgba(1,145,69,0.10);
    display: flex; align-items: flex-start; gap: 14px;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .ud-stat:hover { border-color: rgba(1,145,69,0.22); box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
  .ud-stat-icon {
    width: 40px; height: 40px; border-radius: 2px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
  }
  .ud-stat-value {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 28px; font-weight: 800; color: #0A0F0D; line-height: 1; margin: 0 0 4px;
  }
  .ud-stat-label {
    font-size: 10px; font-weight: 700; letter-spacing: 0.10em; text-transform: uppercase;
    color: #7A8A82; margin: 0;
  }

  /* ── Main grid ── */
  .ud-main { display: grid; grid-template-columns: 300px 1fr; gap: 16px; align-items: start; }
  @media (max-width: 900px) { .ud-main { grid-template-columns: 1fr; } }

  /* ── Profile card ── */
  .ud-profile {
    background: #fff; border: 1px solid rgba(1,145,69,0.10); border-radius: 2px;
    overflow: hidden; position: sticky; top: 80px;
  }
  .ud-card-head {
    padding: 16px 20px; border-bottom: 1px solid rgba(1,145,69,0.08);
    background: #FAFAF8; display: flex; align-items: center; gap: 10px;
  }
  .ud-card-head-icon {
    width: 28px; height: 28px; border-radius: 2px; background: #019145;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .ud-card-head-title { font-size: 13px; font-weight: 700; color: #0A0F0D; margin: 0; }
  .ud-profile-body { padding: 20px; }

  .ud-field { margin-bottom: 16px; }
  .ud-label {
    display: block; font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
    color: #3A4A42; margin-bottom: 7px;
  }
  .ud-input {
    width: 100%; padding: 10px 13px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; color: #0A0F0D;
    background: #FAFAF8; border: 1px solid rgba(1,145,69,0.15);
    border-radius: 2px; outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .ud-input:focus { border-color: #019145; box-shadow: 0 0 0 3px rgba(1,145,69,0.10); background: #fff; }
  .ud-readonly {
    padding: 10px 13px; font-size: 13px; color: #6B7B73;
    background: #F0EEE9; border: 1px solid rgba(1,145,69,0.08);
    border-radius: 2px;
  }
  .ud-fine { font-size: 11px; color: #9AA8A0; margin-top: 8px; line-height: 1.6; }

  .ud-btn-save {
    width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 11px; border-radius: 2px;
    background: #019145; color: #fff;
    font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase; border: none; cursor: pointer;
    transition: background 0.2s, transform 0.15s;
    box-shadow: 0 4px 16px rgba(1,145,69,0.22);
  }
  .ud-btn-save:hover:not(:disabled) { background: #016934; transform: translateY(-1px); }
  .ud-btn-save:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

  /* ── Posts panel ── */
  .ud-posts-panel {
    background: #fff; border: 1px solid rgba(1,145,69,0.10); border-radius: 2px; overflow: hidden;
  }

  /* Tabs */
  .ud-tabs { display: flex; border-bottom: 1px solid rgba(1,145,69,0.08); padding: 0 4px; }
  .ud-tab {
    display: flex; align-items: center; gap: 6px;
    padding: 14px 16px; position: relative; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase;
    background: transparent; border: none;
    transition: color 0.2s;
  }
  .ud-tab.active { color: #019145; }
  .ud-tab.idle   { color: #9AA8A0; }
  .ud-tab.idle:hover { color: #3A4A42; }
  .ud-tab.active::after {
    content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 2px;
    background: #019145; border-radius: 1px 1px 0 0;
  }
  .ud-tab-count {
    padding: 2px 7px; border-radius: 2px; font-size: 10px; font-weight: 700;
    transition: all 0.2s;
  }
  .ud-tab.active .ud-tab-count { background: rgba(1,145,69,0.10); color: #019145; }
  .ud-tab.idle   .ud-tab-count { background: rgba(0,0,0,0.05); color: #9AA8A0; }

  /* Posts list */
  .ud-posts-body { padding: 20px; }

  /* Empty */
  .ud-empty {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 64px 24px; text-align: center;
  }
  .ud-empty-icon {
    width: 56px; height: 56px; border-radius: 2px;
    border: 1px solid rgba(1,145,69,0.10); background: #FAFAF8;
    display: flex; align-items: center; justify-content: center; margin-bottom: 14px;
  }

  /* ── Post row ── */
  .ud-post-row {
    display: flex; gap: 14px;
    padding: 16px; border-radius: 2px;
    border: 1px solid rgba(1,145,69,0.08);
    background: #FAFAF8; margin-bottom: 10px;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .ud-post-row:last-child { margin-bottom: 0; }
  .ud-post-row:hover { border-color: rgba(1,145,69,0.20); box-shadow: 0 2px 12px rgba(0,0,0,0.04); }

  .ud-post-thumb {
    width: 72px; height: 72px; border-radius: 2px; flex-shrink: 0;
    background: #F0EEE9; border: 1px solid rgba(1,145,69,0.08); overflow: hidden;
    display: flex; align-items: center; justify-content: center;
  }
  .ud-post-thumb img { width: 100%; height: 100%; object-fit: cover; }

  .ud-post-title {
    font-size: 13px; font-weight: 700; color: #0A0F0D; margin: 0 0 5px;
    overflow: hidden; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical;
  }
  .ud-post-desc {
    font-size: 11px; color: #6B7B73; line-height: 1.7; margin: 0 0 10px;
    overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
  }
  .ud-post-meta {
    display: flex; flex-wrap: wrap; gap: 12px;
    font-size: 10px; color: #9AA8A0; font-weight: 500;
    margin-bottom: 10px;
  }
  .ud-post-meta-item { display: flex; align-items: center; gap: 4px; }

  /* Status badge */
  .ud-badge {
    display: inline-flex; align-items: center;
    padding: 3px 9px; border-radius: 2px; flex-shrink: 0;
    font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
    border: 1px solid;
  }
  .ud-badge-pending  { background: rgba(180,83,9,0.07);  border-color: rgba(180,83,9,0.20);  color: #B45309; }
  .ud-badge-approved { background: rgba(1,145,69,0.07);  border-color: rgba(1,145,69,0.20);  color: #019145; }
  .ud-badge-rejected { background: rgba(220,38,38,0.07); border-color: rgba(220,38,38,0.18); color: #DC2626; }

  /* Rejection reason */
  .ud-rejection {
    display: flex; align-items: flex-start; gap: 8px;
    padding: 10px 12px; border-radius: 2px; margin-bottom: 10px;
    border: 1px solid rgba(220,38,38,0.14); background: rgba(220,38,38,0.04);
    font-size: 11px; color: rgba(220,38,38,0.85); line-height: 1.7;
  }
  .ud-rejection-label { font-weight: 700; margin-right: 3px; }

  /* Action buttons */
  .ud-actions { display: flex; flex-wrap: wrap; gap: 7px; }
  .ud-btn-action {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 6px 12px; border-radius: 2px;
    font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase;
    border: 1px solid; cursor: pointer; text-decoration: none;
    transition: background 0.15s, border-color 0.15s;
  }
  .ud-btn-view     { background: #FAFAF8; border-color: rgba(1,145,69,0.18);  color: #3A4A42; }
  .ud-btn-view:hover { background: rgba(1,145,69,0.06); border-color: rgba(1,145,69,0.30); color: #019145; }
  .ud-btn-view-dis { background: #F0EEE9; border-color: rgba(0,0,0,0.06); color: #9AA8A0; cursor: default; }
  .ud-btn-edit     { background: rgba(1,145,69,0.06); border-color: rgba(1,145,69,0.20); color: #019145; }
  .ud-btn-edit:hover { background: rgba(1,145,69,0.12); border-color: rgba(1,145,69,0.35); }
  .ud-btn-delete   { background: rgba(220,38,38,0.05); border-color: rgba(220,38,38,0.18); color: #DC2626; }
  .ud-btn-delete:hover { background: rgba(220,38,38,0.10); border-color: rgba(220,38,38,0.30); }

  @media (max-width: 560px) {
    .ud-post-row { flex-direction: column; }
    .ud-post-thumb { width: 100%; height: 120px; }
  }
`;

/* ─── StatCard ─── */
function StatCard({ icon: Icon, label, value, bg, iconColor }) {
  return (
    <div className="ud-stat">
      <div className="ud-stat-icon" style={{ background: bg }}>
        <Icon size={18} color={iconColor} />
      </div>
      <div>
        <p className="ud-stat-value">{value ?? "—"}</p>
        <p className="ud-stat-label">{label}</p>
      </div>
    </div>
  );
}

/* ─── PostRow ─── */
function MyPostRow({ post, onDeleteRequest }) {
  const thumb = post.media?.find((m) => m.type === "image");
  const statusClass =
    post.status === "pending"
      ? "ud-badge-pending"
      : post.status === "approved"
        ? "ud-badge-approved"
        : "ud-badge-rejected";

  return (
    <div className="ud-post-row">
      {/* Thumb */}
      <div className="ud-post-thumb">
        {thumb ? (
          <img src={thumb.url} alt="" />
        ) : (
          <FileText size={18} color="rgba(1,145,69,0.25)" />
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 8,
            marginBottom: 5,
          }}
        >
          <p className="ud-post-title">{post.title}</p>
          <span className={`ud-badge ${statusClass}`}>{post.status}</span>
        </div>

        <p className="ud-post-desc">{post.description}</p>

        <div className="ud-post-meta">
          <span className="ud-post-meta-item">
            <MapPin size={10} color="#019145" />
            {post.location}
          </span>
          <span className="ud-post-meta-item">
            <Clock size={10} />
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </span>
          <span className="ud-post-meta-item">
            <FileText size={10} />
            {post.media?.length || 0} file(s)
          </span>
        </div>

        {post.status === "rejected" && post.rejectionReason && (
          <div className="ud-rejection">
            <span className="ud-rejection-label">Admin feedback:</span>{" "}
            {post.rejectionReason}
          </div>
        )}

        <div className="ud-actions">
          {post.status === "approved" ? (
            <Link
              to={`/post/${post._id}`}
              target="_blank"
              className="ud-btn-action ud-btn-view"
            >
              <Eye size={11} /> View
            </Link>
          ) : (
            <span className="ud-btn-action ud-btn-view-dis">
              <Eye size={11} /> Not public yet
            </span>
          )}
          {post.status === "rejected" && (
            <Link
              to={`/post/${post._id}/edit`}
              className="ud-btn-action ud-btn-edit"
            >
              <Edit3 size={11} /> Edit & Resubmit
            </Link>
          )}
          <button
            onClick={() => onDeleteRequest(post)}
            className="ud-btn-action ud-btn-delete"
          >
            <Trash2 size={11} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main ─── */
export default function UserDashboard() {
  const { user, updateName } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [savingName, setSavingName] = useState(false);
  const [deletingPost, setDeletingPost] = useState(null);
  const [deletebusy, setDeleteBusy] = useState(false);

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user?.name]);

  const fetchData = useCallback(async () => {
    try {
      const params = { limit: 20 };
      if (activeTab !== "all") params.status = activeTab;
      const [statsRes, postsRes] = await Promise.all([
        api.get("/users/me/stats"),
        api.get("/posts/my", { params }),
      ]);
      setStats(statsRes.data.data);
      setPosts(postsRes.data.data);
    } catch (_) {
      toast.error("Failed to load your dashboard");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeTab]);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  const refresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleDelete = async (postId) => {
    try {
      await api.delete(`/posts/${postId}`);
      setPosts((p) => p.filter((x) => x._id !== postId));
      const s = await api.get("/users/me/stats");
      setStats(s.data.data);
      toast.success("Post deleted");
    } catch (_) {
      toast.error("Failed to delete post");
    }
  };

  const confirmDelete = async () => {
    if (!deletingPost) return;
    setDeleteBusy(true);
    await handleDelete(deletingPost._id);
    setDeleteBusy(false);
    setDeletingPost(null);
  };

  const handleNameSave = async (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return toast.error("Name is required");
    if (trimmed.length > 100) return toast.error("Name is too long");
    setSavingName(true);
    try {
      await updateName(trimmed);
      toast.success("Name updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update name");
    } finally {
      setSavingName(false);
    }
  };

  const tabs = useMemo(
    () => [
      { key: "all", label: "All", count: stats?.total },
      { key: "pending", label: "Pending", count: stats?.pending },
      { key: "approved", label: "Approved", count: stats?.approved },
      { key: "rejected", label: "Rejected", count: stats?.rejected },
    ],
    [stats],
  );

  return (
    <div className="ud-root">
      <style>{css}</style>

      {/* ══ HEADER ══ */}
      <div className="ud-header">
        <div className="ud-header-grid" />
        <div className="ud-header-glow" />
        <div className="ud-header-inner">
          <div className="ud-header-left">
            <div className="ud-header-icon">
              <User size={20} color="#fff" />
            </div>
            <div>
              <div className="ud-eyebrow">My Account</div>
              <h1 className="ud-header-h1">User Dashboard</h1>
              <p className="ud-header-sub">
                Track your submissions and manage your account
              </p>
            </div>
          </div>
          <button
            className="ud-btn-refresh"
            onClick={refresh}
            disabled={refreshing}
          >
            <RefreshCw
              size={12}
              style={{
                animation: refreshing ? "spin 0.8s linear infinite" : "none",
              }}
            />
            Refresh
          </button>
        </div>
      </div>

      <div className="ud-body">
        {/* ── Stat cards ── */}
        <div className="ud-stats">
          <StatCard
            icon={FileText}
            label="Total Reports"
            value={stats?.total}
            bg="rgba(1,145,69,0.08)"
            iconColor="#019145"
          />
          <StatCard
            icon={Clock}
            label="Pending"
            value={stats?.pending}
            bg="rgba(180,83,9,0.08)"
            iconColor="#B45309"
          />
          <StatCard
            icon={CheckCircle}
            label="Approved"
            value={stats?.approved}
            bg="rgba(1,145,69,0.08)"
            iconColor="#019145"
          />
          <StatCard
            icon={XCircle}
            label="Rejected"
            value={stats?.rejected}
            bg="rgba(220,38,38,0.08)"
            iconColor="#DC2626"
          />
        </div>

        {/* ── Main grid ── */}
        <div className="ud-main">
          {/* Profile card */}
          <div className="ud-profile">
            <div className="ud-card-head">
              <div className="ud-card-head-icon">
                <Edit3 size={13} color="#fff" />
              </div>
              <p className="ud-card-head-title">Profile Settings</p>
            </div>
            <div className="ud-profile-body">
              <form onSubmit={handleNameSave}>
                <div className="ud-field">
                  <label className="ud-label">Display Name</label>
                  <input
                    className="ud-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={100}
                  />
                </div>
                <div className="ud-field">
                  <label className="ud-label">Email / Phone</label>
                  <div className="ud-readonly">
                    {user?.email || user?.phone || "Not provided"}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={savingName}
                  className="ud-btn-save"
                  style={{ marginBottom: 12 }}
                >
                  {savingName ? <LoadingSpinner size="sm" /> : "Save Changes"}
                </button>
              </form>
              <p className="ud-fine">
                For security reasons, email and phone cannot be changed here.
              </p>
            </div>
          </div>

          {/* Posts panel */}
          <div className="ud-posts-panel">
            {/* Tabs */}
            <div className="ud-tabs">
              {tabs.map(({ key, label, count }) => (
                <button
                  key={key}
                  className={`ud-tab ${activeTab === key ? "active" : "idle"}`}
                  onClick={() => setActiveTab(key)}
                >
                  {label}
                  {count !== undefined && (
                    <span className="ud-tab-count">{count}</span>
                  )}
                </button>
              ))}
            </div>

            <div className="ud-posts-body">
              {loading ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "64px 0",
                  }}
                >
                  <LoadingSpinner size="lg" />
                </div>
              ) : posts.length === 0 ? (
                <div className="ud-empty">
                  <div className="ud-empty-icon">
                    <FileText size={22} color="rgba(1,145,69,0.25)" />
                  </div>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#3A4A42",
                      margin: "0 0 5px",
                    }}
                  >
                    No posts yet
                  </p>
                  <p style={{ fontSize: 12, color: "#9AA8A0", margin: 0 }}>
                    {activeTab === "all"
                      ? "Start by submitting your first report."
                      : "No posts match this status."}
                  </p>
                </div>
              ) : (
                <div>
                  {posts.map((post) => (
                    <MyPostRow
                      key={post._id}
                      post={post}
                      onDeleteRequest={setDeletingPost}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={!!deletingPost}
        variant="delete"
        title="Delete this report?"
        description="Are you sure you want to permanently delete this report? This cannot be undone."
        postTitle={deletingPost?.title}
        busy={deletebusy}
        onConfirm={confirmDelete}
        onClose={() => !deletebusy && setDeletingPost(null)}
      />
    </div>
  );
}
