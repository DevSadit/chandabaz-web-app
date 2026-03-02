import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  Calendar,
  User,
  UserX,
  Eye,
  Tag,
  ArrowLeft,
  Share2,
  Trash2,
  Clock,
  FileText,
  Image,
  Film,
  FileDown,
  ExternalLink,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import MediaViewer from "../components/MediaViewer";
import CommentSection from "../components/CommentSection";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";
import BribeReceipt, { downloadReceiptPDF } from "../components/BribeReceipt";

/* ─── Styles ─── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');

  .pd-root * { box-sizing: border-box; }
  .pd-root {
    font-family: 'DM Sans', sans-serif;
    background: #F7F5F0;
    min-height: 100vh;
  }

  /* ── Top bar (back + actions) ── */
  .pd-topbar {
    background: #0A0F0D;
    border-bottom: 1px solid rgba(1,145,69,0.12);
    position: relative; overflow: hidden;
  }
  .pd-topbar::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(1,145,69,0.50), transparent);
  }
  .pd-topbar-grid {
    position: absolute; inset: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(1,145,69,0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(1,145,69,0.035) 1px, transparent 1px);
    background-size: 48px 48px;
  }
  .pd-topbar-inner {
    max-width: 1280px; margin: 0 auto; padding: 16px 32px;
    position: relative; z-index: 2;
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
  }
  @media (max-width: 640px) { .pd-topbar-inner { padding: 14px 20px; } }

  .pd-back {
    display: inline-flex; align-items: center; gap: 7px;
    font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
    color: rgba(255,255,255,0.45); text-decoration: none;
    padding: 7px 14px; border-radius: 2px;
    border: 1px solid rgba(255,255,255,0.08);
    transition: color 0.2s, border-color 0.2s, background 0.2s;
  }
  .pd-back:hover { color: #fff; border-color: rgba(1,145,69,0.30); background: rgba(1,145,69,0.06); }

  .pd-top-actions { display: flex; align-items: center; gap: 8px; }

  .pd-btn-share {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: 2px;
    background: transparent; border: 1px solid rgba(255,255,255,0.10);
    color: rgba(255,255,255,0.55);
    font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
  }
  .pd-btn-share:hover { border-color: rgba(1,145,69,0.35); color: #fff; background: rgba(1,145,69,0.07); }

  .pd-btn-delete {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: 2px;
    background: rgba(220,38,38,0.06); border: 1px solid rgba(220,38,38,0.20);
    color: rgba(220,38,38,0.80);
    font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer;
    transition: background 0.2s, border-color 0.2s, color 0.2s;
  }
  .pd-btn-delete:hover { background: rgba(220,38,38,0.12); border-color: rgba(220,38,38,0.35); color: #DC2626; }
  .pd-btn-delete:disabled { opacity: 0.5; cursor: not-allowed; }

  /* ── Page body ── */
  .pd-body { max-width: 1280px; margin: 0 auto; padding: 32px 32px 80px; }
  @media (max-width: 640px) { .pd-body { padding: 24px 20px 60px; } }

  /* ── Headline area ── */
  .pd-headline-area { margin-bottom: 28px; }
  .pd-eyebrow {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 9px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase;
    color: #019145; margin-bottom: 10px;
  }
  .pd-eyebrow::before, .pd-eyebrow::after {
    content: ''; display: block; width: 14px; height: 1px; background: #019145; opacity: 0.4;
  }
  .pd-h1 {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(1.5rem, 3vw, 2.25rem);
    font-weight: 800; color: #0A0F0D; letter-spacing: -0.02em; line-height: 1.15;
    margin: 0;
  }

  /* ── Grid ── */
  .pd-grid {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 20px;
    align-items: start;
  }
  @media (max-width: 960px) { .pd-grid { grid-template-columns: 1fr; } }

  /* ── Generic card ── */
  .pd-card {
    background: #fff;
    border: 1px solid rgba(1,145,69,0.10);
    border-radius: 2px;
    overflow: hidden;
  }
  .pd-card + .pd-card { margin-top: 16px; }

  /* Card section head (used in sidebar) */
  .pd-card-head {
    padding: 14px 20px;
    border-bottom: 1px solid rgba(1,145,69,0.08);
    background: #FAFAF8;
    display: flex; align-items: center; gap: 10px;
  }
  .pd-card-head-bar {
    width: 3px; height: 18px; border-radius: 1px; background: #019145; flex-shrink: 0;
  }
  .pd-card-head-title { font-size: 12px; font-weight: 700; color: #0A0F0D; margin: 0; }
  .pd-card-head-sub   { font-size: 10px; color: #9AA8A0; margin: 2px 0 0; }

  /* Media card */
  .pd-media-card { padding: 20px; }

  /* Content card */
  .pd-content-card { padding: 28px 32px; }
  .pd-description {
    font-size: 14px; color: #3A4A42; line-height: 1.85;
    white-space: pre-wrap; margin: 0;
  }

  /* Tags */
  .pd-tags {
    display: flex; flex-wrap: wrap; gap: 7px;
    margin-top: 24px; padding-top: 20px;
    border-top: 1px solid rgba(1,145,69,0.08);
  }
  .pd-tag {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 11px; border-radius: 2px;
    background: rgba(1,145,69,0.06); border: 1px solid rgba(1,145,69,0.16);
    font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
    color: #019145;
  }

  /* Comments card */
  .pd-comments-card { padding: 28px 32px; }

  /* ── Sidebar ── */
  .pd-sidebar { display: flex; flex-direction: column; gap: 16px; }
  @media (min-width: 960px) { .pd-sidebar { position: sticky; top: 80px; } }

  /* Meta items */
  .pd-meta-list { padding: 4px 0; }
  .pd-meta-item {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 13px 20px;
    border-bottom: 1px solid rgba(1,145,69,0.06);
  }
  .pd-meta-item:last-child { border-bottom: none; }
  .pd-meta-icon {
    width: 32px; height: 32px; border-radius: 2px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    margin-top: 1px;
  }
  .pd-meta-label {
    font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
    color: #9AA8A0; margin: 0 0 3px;
  }
  .pd-meta-value { font-size: 13px; font-weight: 600; color: #0A0F0D; margin: 0; }

  /* View count pill */
  .pd-view-pill {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 10px; border-radius: 2px;
    background: rgba(1,145,69,0.06); border: 1px solid rgba(1,145,69,0.14);
    font-size: 10px; font-weight: 700; color: #019145;
  }

  /* Evidence files */
  .pd-evidence-list { padding: 0 20px 16px; display: flex; flex-direction: column; gap: 7px; }
  .pd-evidence-item {
    display: flex; align-items: center; gap: 9px;
    padding: 9px 12px; border-radius: 2px; border: 1px solid;
    font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
  }
  .pd-ev-image { background: rgba(14,165,233,0.06); border-color: rgba(14,165,233,0.20); color: #0369A1; }
  .pd-ev-video { background: rgba(139,92,246,0.06); border-color: rgba(139,92,246,0.20); color: #7C3AED; }
  .pd-ev-pdf   { background: rgba(180,83,9,0.06);   border-color: rgba(180,83,9,0.18);   color: #B45309; }
  .pd-ev-other { background: rgba(0,0,0,0.03);       border-color: rgba(0,0,0,0.08);       color: #6B7B73; }
  .pd-ev-filename {
    margin-left: auto; font-weight: 400; font-size: 10px;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100px;
    opacity: 0.6;
  }

  /* Share CTA */
  .pd-share-cta {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    width: 100%; padding: 12px; border-radius: 2px;
    background: transparent; border: 1px solid rgba(1,145,69,0.18);
    color: #019145;
    font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
  }
  .pd-share-cta:hover { background: rgba(1,145,69,0.06); border-color: rgba(1,145,69,0.35); }

  /* Loading */
  .pd-loading {
    display: flex; align-items: center; justify-content: center;
    min-height: calc(100vh - 64px); background: #F7F5F0;
  }

  /* Receipt button */
  .pd-btn-receipt {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: 2px;
    background: rgba(180,120,0,0.08); border: 1px solid rgba(180,120,0,0.30);
    color: #8B6914;
    font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
  }
  .pd-btn-receipt:hover { background: rgba(180,120,0,0.14); border-color: rgba(180,120,0,0.45); color: #7A5204; }
  .pd-btn-receipt:disabled { opacity: 0.50; cursor: not-allowed; }
`;

const mediaTypeIcon = { image: Image, video: Film, pdf: FileText };
const mediaEvClass = {
  image: "pd-ev-image",
  video: "pd-ev-video",
  pdf: "pd-ev-pdf",
};

/* ─── Sidebar meta item ─── */
function MetaItem({ icon: Icon, label, value, iconBg, iconColor, children }) {
  return (
    <div className="pd-meta-item">
      <div className="pd-meta-icon" style={{ background: iconBg }}>
        <Icon size={13} color={iconColor} />
      </div>
      <div style={{ minWidth: 0 }}>
        <p className="pd-meta-label">{label}</p>
        {children || <p className="pd-meta-value">{value}</p>}
      </div>
    </div>
  );
}

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const receiptRef = useRef(null);
  const [generatingReceipt, setGeneratingReceipt] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const { data } = await api.get(`/posts/${id}`);
      setPost(data.data);
    } catch (err) {
      if (err.response?.status === 404) navigate("/", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: post.title, url });
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this post? This cannot be undone.",
      )
    )
      return;
    setDeleting(true);
    try {
      await api.delete(`/posts/${id}`);
      toast.success("Post deleted");
      navigate("/");
    } catch (_) {
      toast.error("Failed to delete post");
      setDeleting(false);
    }
  };

  const handleGenerateReceipt = async () => {
    setGeneratingReceipt(true);
    try {
      const receiptUrl = await downloadReceiptPDF(receiptRef, post);
      toast.success("Receipt downloaded!");
      if (receiptUrl) {
        setPost((prev) => ({ ...prev, receiptUrl }));
      }
    } catch {
      toast.error("Failed to generate receipt");
    } finally {
      setGeneratingReceipt(false);
    }
  };

  if (loading)
    return (
      <div className="pd-root">
        <style>{css}</style>
        <div className="pd-loading">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  if (!post) return null;

  const isOwner = user && post.author && post.author._id === user._id;
  const canDelete = isAdmin || isOwner;

  return (
    <div className="pd-root">
      <style>{css}</style>

      {/* ══ TOP BAR ══ */}
      <div className="pd-topbar">
        <div className="pd-topbar-grid" />
        <div className="pd-topbar-inner">
          <Link to="/" className="pd-back">
            <ArrowLeft size={13} /> Back to Reports
          </Link>
          <div className="pd-top-actions">
            <button className="pd-btn-share" onClick={handleShare}>
              <Share2 size={12} /> Share
            </button>
            {isOwner && (
              <button
                className="pd-btn-receipt"
                onClick={handleGenerateReceipt}
                disabled={generatingReceipt}
              >
                {generatingReceipt ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <FileDown size={12} />
                )}
                Generate Receipt of Dishonesty
              </button>
            )}
            {canDelete && (
              <button
                className="pd-btn-delete"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? <LoadingSpinner size="sm" /> : <Trash2 size={12} />}
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="pd-body">
        {/* ── Headline ── */}
        <div className="pd-headline-area">
          <div className="pd-eyebrow">Verified Report</div>
          <h1 className="pd-h1">{post.title}</h1>
        </div>

        {/* ── Main grid ── */}
        <div className="pd-grid">
          {/* ── Left column ── */}
          <div>
            {/* Media */}
            {post.media?.length > 0 && (
              <div className="pd-card">
                <div className="pd-card-head">
                  <div className="pd-card-head-bar" />
                  <div>
                    <p className="pd-card-head-title">Evidence Media</p>
                    <p className="pd-card-head-sub">
                      {post.media.length} file(s) attached
                    </p>
                  </div>
                </div>
                <div className="pd-media-card">
                  <MediaViewer media={post.media} />
                </div>
              </div>
            )}

            {/* Description */}
            <div
              className="pd-card"
              style={{ marginTop: post.media?.length > 0 ? 16 : 0 }}
            >
              <div className="pd-card-head">
                <div className="pd-card-head-bar" />
                <div>
                  <p className="pd-card-head-title">Report Details</p>
                  <p className="pd-card-head-sub">Full incident description</p>
                </div>
              </div>
              <div className="pd-content-card">
                <p className="pd-description">{post.description}</p>

                {post.tags?.length > 0 && (
                  <div className="pd-tags">
                    {post.tags.map((tag, i) => (
                      <span key={i} className="pd-tag">
                        <Tag size={9} /> {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Comments */}
            <div className="pd-card" style={{ marginTop: 16 }}>
              <div className="pd-card-head">
                <div className="pd-card-head-bar" />
                <div>
                  <p className="pd-card-head-title">Community Discussion</p>
                  <p className="pd-card-head-sub">
                    Add context or corroborate this report
                  </p>
                </div>
              </div>
              <div className="pd-comments-card">
                <CommentSection postId={post._id} />
              </div>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="pd-sidebar">
            {/* Metadata */}
            <div className="pd-card">
              <div className="pd-card-head">
                <div className="pd-card-head-bar" />
                <div>
                  <p className="pd-card-head-title">Report Info</p>
                  <p className="pd-card-head-sub">Submitted evidence details</p>
                </div>
              </div>
              <div className="pd-meta-list">
                <MetaItem
                  icon={MapPin}
                  label="Location"
                  value={post.location}
                  iconBg="rgba(1,145,69,0.08)"
                  iconColor="#019145"
                />

                <MetaItem
                  icon={Calendar}
                  label="Incident Date"
                  value={format(new Date(post.incidentDate), "MMMM d, yyyy")}
                  iconBg="rgba(14,165,233,0.08)"
                  iconColor="#0369A1"
                />

                <MetaItem
                  icon={post.isAnonymous ? UserX : User}
                  label="Submitted by"
                  value={
                    post.isAnonymous
                      ? "Anonymous Citizen"
                      : post.author?.name || "Unknown"
                  }
                  iconBg={
                    post.isAnonymous
                      ? "rgba(180,83,9,0.08)"
                      : "rgba(0,0,0,0.05)"
                  }
                  iconColor={post.isAnonymous ? "#B45309" : "#6B7B73"}
                />

                <MetaItem
                  icon={Clock}
                  label="Published"
                  value={formatDistanceToNow(new Date(post.createdAt), {
                    addSuffix: true,
                  })}
                  iconBg="rgba(0,0,0,0.04)"
                  iconColor="#6B7B73"
                />

                <MetaItem
                  icon={Eye}
                  label="Views"
                  iconBg="rgba(1,145,69,0.06)"
                  iconColor="#019145"
                >
                  <span className="pd-view-pill">
                    <Eye size={10} /> {post.viewCount} views
                  </span>
                </MetaItem>
              </div>
            </div>

            {/* Evidence files */}
            {post.media?.length > 0 && (
              <div className="pd-card">
                <div className="pd-card-head">
                  <div className="pd-card-head-bar" />
                  <div>
                    <p className="pd-card-head-title">
                      Evidence Files
                      <span
                        style={{
                          fontWeight: 500,
                          color: "#9AA8A0",
                          marginLeft: 6,
                          fontSize: 10,
                        }}
                      >
                        ({post.media.length})
                      </span>
                    </p>
                    <p className="pd-card-head-sub">
                      Attached media and documents
                    </p>
                  </div>
                </div>
                <div className="pd-evidence-list">
                  {post.media.map((m, i) => {
                    const Icon = mediaTypeIcon[m.type] || FileText;
                    const evClass = mediaEvClass[m.type] || "pd-ev-other";
                    return (
                      <div key={i} className={`pd-evidence-item ${evClass}`}>
                        <Icon size={11} />
                        <span style={{ textTransform: "capitalize" }}>
                          {m.type}
                        </span>
                        {m.filename && (
                          <span className="pd-ev-filename">{m.filename}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Receipt PDF link — visible to owner once receipt has been generated */}
            {isOwner && post.receiptUrl && (
              <div className="pd-card">
                <div className="pd-card-head">
                  <div className="pd-card-head-bar" style={{ background: "#B45309" }} />
                  <div>
                    <p className="pd-card-head-title">Receipt of Dishonesty</p>
                    <p className="pd-card-head-sub">Your official bribe receipt</p>
                  </div>
                </div>
                <div style={{ padding: "16px 20px" }}>
                  <a
                    href={post.receiptUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 7,
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: 2,
                      background: "rgba(180,120,0,0.07)",
                      border: "1px solid rgba(180,120,0,0.28)",
                      color: "#8B6914",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      textDecoration: "none",
                      justifyContent: "center",
                      transition: "background 0.2s",
                    }}
                  >
                    <ExternalLink size={12} /> View PDF Receipt
                  </a>
                </div>
              </div>
            )}

            {/* Share CTA */}
            <button className="pd-share-cta" onClick={handleShare}>
              <Share2 size={13} /> Share this Report
            </button>
          </div>
        </div>
      </div>

      {/* Off-screen receipt template — captured by html2canvas on demand */}
      <BribeReceipt ref={receiptRef} post={post} />
    </div>
  );
}
