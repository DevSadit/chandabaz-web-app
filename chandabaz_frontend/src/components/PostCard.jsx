import { Link } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Image,
  Video,
  FileText,
  Eye,
  UserX,
  User,
  ArrowUpRight,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

/* ─── Inline styles scoped to .postcard-root ─── */
const cardCss = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

  .pc-root {
    font-family: 'DM Sans', sans-serif;
  }

  .pc-card {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #fff;
    border: 1px solid rgba(1,145,69,0.10);
    border-radius: 2px;
    text-decoration: none;
    position: relative;
    transition: box-shadow 0.25s, transform 0.25s, border-color 0.25s;
  }
  .pc-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 2px;
    background: #019145;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
    z-index: 2;
  }
  .pc-card:hover {
    box-shadow: 0 12px 48px rgba(0,0,0,0.10);
    transform: translateY(-3px);
    border-color: rgba(1,145,69,0.20);
  }
  .pc-card:hover::before {
    transform: scaleX(1);
  }

  /* ── Thumbnail ── */
  .pc-thumb {
    position: relative;
    height: 200px;
    background: #F0F5F2;
    overflow: hidden;
    flex-shrink: 0;
  }
  .pc-thumb img {
    width: 100%; height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
    display: block;
  }
  .pc-card:hover .pc-thumb img {
    transform: scale(1.06);
  }
  .pc-thumb-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(10,15,13,0.55) 0%, transparent 55%);
    opacity: 0;
    transition: opacity 0.35s;
  }
  .pc-card:hover .pc-thumb-overlay {
    opacity: 1;
  }

  /* No-media placeholder */
  .pc-thumb-empty {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    height: 100%; gap: 10px;
  }
  .pc-thumb-icon {
    width: 52px; height: 52px;
    border: 1px solid rgba(1,145,69,0.15);
    background: #fff;
    display: flex; align-items: center; justify-content: center;
    border-radius: 2px;
  }
  .pc-thumb-label {
    font-size: 11px; font-weight: 600;
    color: #019145; letter-spacing: 0.08em; text-transform: uppercase;
  }

  /* Arrow chip */
  .pc-arrow {
    position: absolute; top: 12px; right: 12px;
    width: 34px; height: 34px;
    background: #fff;
    border-radius: 2px;
    display: flex; align-items: center; justify-content: center;
    opacity: 0;
    transform: translate(6px, -6px);
    transition: opacity 0.25s, transform 0.25s;
    box-shadow: 0 2px 12px rgba(0,0,0,0.12);
    z-index: 3;
  }
  .pc-card:hover .pc-arrow {
    opacity: 1;
    transform: translate(0, 0);
  }

  /* Status badge */
  .pc-badge-pending {
    position: absolute; bottom: 10px; left: 10px;
    font-size: 9px; font-weight: 700; letter-spacing: 0.12em;
    text-transform: uppercase; color: #B45309;
    background: rgba(254,243,199,0.95);
    border: 1px solid rgba(180,83,9,0.2);
    padding: 3px 8px;
    border-radius: 2px;
    z-index: 3;
  }

  /* Media type chips */
  .pc-chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .pc-chip {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 9px; font-weight: 700; letter-spacing: 0.10em; text-transform: uppercase;
    padding: 3px 7px; border-radius: 2px;
    border: 1px solid;
  }
  .pc-chip-image { color: #019145; background: rgba(1,145,69,0.07); border-color: rgba(1,145,69,0.18); }
  .pc-chip-video { color: #7C3AED; background: rgba(139,92,246,0.07); border-color: rgba(139,92,246,0.18); }
  .pc-chip-pdf   { color: #B45309; background: rgba(251,191,36,0.07); border-color: rgba(251,191,36,0.25); }

  /* Title */
  .pc-title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 15px; font-weight: 700; line-height: 1.35;
    color: #0A0F0D; margin: 0;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    transition: color 0.2s;
  }
  .pc-card:hover .pc-title { color: #019145; }

  /* Description */
  .pc-desc {
    font-size: 12px; color: #6B7B73; line-height: 1.75; margin: 0; flex: 1;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  }

  /* Meta */
  .pc-meta {
    margin-top: auto;
    padding-top: 12px;
    border-top: 1px solid rgba(1,145,69,0.08);
    display: flex; flex-direction: column; gap: 8px;
  }
  .pc-meta-row {
    display: flex; align-items: center; justify-content: space-between;
    font-size: 11px; color: #7A8A82;
  }
  .pc-meta-item {
    display: inline-flex; align-items: center; gap: 5px;
    font-weight: 500;
  }
  .pc-meta-item.truncate span { max-width: 110px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: block; }
  .pc-anon { color: #B45309; font-weight: 600; }
  .pc-views { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; color: #9AA8A0; }

  /* Content padding */
  .pc-body {
    padding: 18px 20px 20px;
    display: flex; flex-direction: column; flex: 1; gap: 12px;
  }
`;

const mediaMeta = {
  image: { icon: Image, chipCls: "pc-chip-image", label: "Image" },
  video: { icon: Video, chipCls: "pc-chip-video", label: "Video" },
  pdf: { icon: FileText, chipCls: "pc-chip-pdf", label: "Doc" },
};

function MediaChips({ media }) {
  const counts = media.reduce((acc, m) => {
    acc[m.type] = (acc[m.type] || 0) + 1;
    return acc;
  }, {});
  return (
    <div className="pc-chips">
      {Object.entries(counts).map(([type, count]) => {
        const { icon: Icon, chipCls } = mediaMeta[type] || mediaMeta.image;
        return (
          <span key={type} className={`pc-chip ${chipCls}`}>
            <Icon size={10} /> {count} {mediaMeta[type]?.label || type}
          </span>
        );
      })}
    </div>
  );
}

export default function PostCard({ post }) {
  const firstImage = post.media?.find((m) => m.type === "image");
  const hasVideo = post.media?.some((m) => m.type === "video");
  const isPdf = post.media?.[0]?.type === "pdf";

  return (
    <div className="pc-root">
      <style>{cardCss}</style>
      <Link to={`/post/${post._id}`} className="pc-card">
        {/* ── Thumbnail ── */}
        <div className="pc-thumb">
          {firstImage ? (
            <>
              <img src={firstImage.url} alt={post.title} loading="lazy" />
              <div className="pc-thumb-overlay" />
            </>
          ) : (
            <div className="pc-thumb-empty">
              <div className="pc-thumb-icon">
                {hasVideo ? (
                  <Video size={22} color="#7C3AED" />
                ) : isPdf ? (
                  <FileText size={22} color="#B45309" />
                ) : (
                  <Image size={22} color="#019145" />
                )}
              </div>
              <span className="pc-thumb-label">
                {hasVideo ? "Video Evidence" : isPdf ? "Document" : "No Media"}
              </span>
            </div>
          )}

          {/* Arrow */}
          <div className="pc-arrow">
            <ArrowUpRight size={15} color="#019145" />
          </div>

          {/* Pending */}
          {post.status === "pending" && (
            <span className="pc-badge-pending">Under Review</span>
          )}
        </div>

        {/* ── Body ── */}
        <div className="pc-body">
          {/* Media chips */}
          {post.media?.length > 0 && <MediaChips media={post.media} />}

          {/* Title */}
          <h3 className="pc-title">{post.title}</h3>

          {/* Description */}
          <p className="pc-desc">{post.description}</p>

          {/* Meta */}
          <div className="pc-meta">
            {/* Row 1 — location + date */}
            <div className="pc-meta-row">
              <span className="pc-meta-item truncate">
                <MapPin size={11} color="#019145" />
                <span>{post.location}</span>
              </span>
              <span className="pc-meta-item">
                <Calendar size={11} color="#9AA8A0" />
                {formatDistanceToNow(new Date(post.incidentDate), {
                  addSuffix: true,
                })}
              </span>
            </div>

            {/* Row 2 — author + views */}
            <div className="pc-meta-row">
              <span className="pc-meta-item">
                {post.isAnonymous ? (
                  <>
                    <UserX size={11} color="#B45309" />
                    <span className="pc-anon">Anonymous</span>
                  </>
                ) : (
                  <>
                    <User size={11} color="#9AA8A0" />
                    <span
                      style={{
                        maxWidth: 100,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {post.author?.name || "Unknown"}
                    </span>
                  </>
                )}
              </span>
              <span className="pc-views">
                <Eye size={11} />
                {post.viewCount ?? 0}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
