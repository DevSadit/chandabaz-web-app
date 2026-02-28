import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Upload,
  MapPin,
  Calendar,
  Tag,
  UserX,
  CheckCircle,
  AlertTriangle,
  FileText,
  Image,
  Film,
} from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";
import DragDropUpload from "../components/DragDropUpload";
import LoadingSpinner from "../components/LoadingSpinner";

/* ─── Styles ─── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');

  .sb-root * { box-sizing: border-box; }
  .sb-root { font-family: 'DM Sans', sans-serif; background: #F7F5F0; min-height: calc(100vh - 64px); }

  /* ── Page header ── */
  .sb-header {
    background: #0A0F0D;
    position: relative; overflow: hidden;
    border-bottom: 1px solid rgba(1,145,69,0.15);
  }
  .sb-header::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(1,145,69,0.55), transparent);
  }
  .sb-header-grid {
    position: absolute; inset: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(1,145,69,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(1,145,69,0.04) 1px, transparent 1px);
    background-size: 48px 48px;
  }
  .sb-header-glow {
    position: absolute; top: -60%; right: -5%; width: 500px; height: 400px;
    background: radial-gradient(circle, rgba(1,145,69,0.15) 0%, transparent 65%);
    filter: blur(60px); pointer-events: none;
  }
  .sb-header-inner {
    max-width: 720px; margin: 0 auto; padding: 36px 32px;
    position: relative; z-index: 2;
    display: flex; align-items: flex-start; gap: 16px;
  }
  @media (max-width: 640px) { .sb-header-inner { padding: 28px 20px; } }

  .sb-header-icon {
    width: 44px; height: 44px; border-radius: 2px; flex-shrink: 0;
    background: #019145;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 20px rgba(1,145,69,0.30);
  }
  .sb-header-h1 {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 24px; font-weight: 800; color: #fff;
    letter-spacing: -0.02em; margin: 0 0 5px;
  }
  .sb-header-sub { font-size: 12px; color: rgba(255,255,255,0.40); margin: 0; line-height: 1.6; }
  .sb-eyebrow {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 9px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase;
    color: #019145; margin-bottom: 8px;
  }
  .sb-eyebrow::before, .sb-eyebrow::after {
    content: ''; display: block; width: 14px; height: 1px; background: #019145; opacity: 0.4;
  }

  /* ── Layout ── */
  .sb-body { max-width: 720px; margin: 0 auto; padding: 32px 32px 64px; }
  @media (max-width: 640px) { .sb-body { padding: 24px 20px 48px; } }

  /* ── Admin feedback ── */
  .sb-feedback {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 16px 18px; border-radius: 2px; margin-bottom: 24px;
    background: rgba(220,38,38,0.05);
    border: 1px solid rgba(220,38,38,0.18);
  }
  .sb-feedback-label {
    font-size: 10px; font-weight: 700; letter-spacing: 0.10em; text-transform: uppercase;
    color: #DC2626; margin-bottom: 3px;
  }
  .sb-feedback-text { font-size: 12px; color: rgba(220,38,38,0.85); line-height: 1.7; margin: 0; }

  /* ── Stepper ── */
  .sb-stepper {
    display: flex; align-items: flex-start;
    margin-bottom: 28px; position: relative;
  }
  .sb-step { display: flex; flex-direction: column; align-items: center; flex: 1; }
  .sb-step:last-child { flex: 0; }
  .sb-step-circle {
    width: 36px; height: 36px; border-radius: 2px;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; border: 1px solid;
    transition: all 0.25s;
  }
  .sb-step-circle.done  { background: #019145; border-color: #019145; color: #fff; }
  .sb-step-circle.active { background: rgba(1,145,69,0.08); border-color: #019145; color: #019145; }
  .sb-step-circle.idle  { background: #fff; border-color: rgba(1,145,69,0.15); color: rgba(0,0,0,0.30); }
  .sb-step-label {
    font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
    margin-top: 7px; text-align: center;
  }
  .sb-step-label.done, .sb-step-label.active { color: #019145; }
  .sb-step-label.idle  { color: rgba(0,0,0,0.28); }
  .sb-step-desc { font-size: 10px; color: rgba(0,0,0,0.30); margin-top: 1px; text-align: center; }
  .sb-step-connector {
    flex: 1; height: 1px; margin-top: 17px; transition: background 0.3s;
  }
  .sb-step-connector.done   { background: #019145; }
  .sb-step-connector.idle   { background: rgba(1,145,69,0.12); }

  /* ── Card ── */
  .sb-card {
    background: #fff;
    border: 1px solid rgba(1,145,69,0.12);
    border-radius: 2px;
    overflow: hidden;
    box-shadow: 0 4px 32px rgba(0,0,0,0.05);
  }
  .sb-card-head {
    padding: 20px 28px;
    border-bottom: 1px solid rgba(1,145,69,0.08);
    background: #FAFAF8;
    display: flex; align-items: center; gap: 12px;
  }
  .sb-card-head-num {
    width: 28px; height: 28px; border-radius: 2px; flex-shrink: 0;
    background: #019145; display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: #fff;
  }
  .sb-card-head-title { font-size: 14px; font-weight: 700; color: #0A0F0D; margin: 0; }
  .sb-card-head-desc  { font-size: 11px; color: #6B7B73; margin: 2px 0 0; }
  .sb-card-body { padding: 28px; }

  /* ── Form fields ── */
  .sb-field { margin-bottom: 22px; }
  .sb-label {
    display: flex; align-items: center; gap: 5px;
    font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
    color: #3A4A42; margin-bottom: 8px;
  }
  .sb-req { color: #DC2626; margin-left: 1px; }
  .sb-opt { font-weight: 500; color: #9AA8A0; text-transform: none; letter-spacing: 0; font-size: 10px; margin-left: 2px; }
  .sb-input {
    width: 100%; padding: 11px 14px;
    font-family: 'DM Sans', sans-serif; font-size: 14px; color: #0A0F0D;
    background: #FAFAF8; border: 1px solid rgba(1,145,69,0.15);
    border-radius: 2px; outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }
  .sb-input::placeholder { color: #9AA8A0; }
  .sb-input:focus {
    border-color: #019145;
    box-shadow: 0 0 0 3px rgba(1,145,69,0.10);
    background: #fff;
  }
  textarea.sb-input { resize: none; line-height: 1.7; }
  .sb-char-count { font-size: 10px; color: #9AA8A0; text-align: right; margin-top: 5px; }

  /* Grid 2col */
  .sb-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 560px) { .sb-grid2 { grid-template-columns: 1fr; } }

  /* ── Anonymous toggle ── */
  .sb-anon {
    display: flex; align-items: center; gap: 16px;
    padding: 16px 18px; border-radius: 2px; border: 1px solid;
    transition: all 0.25s;
  }
  .sb-anon.on  { background: rgba(180,83,9,0.04); border-color: rgba(180,83,9,0.22); }
  .sb-anon.off { background: #FAFAF8; border-color: rgba(1,145,69,0.12); }
  .sb-anon-icon {
    width: 40px; height: 40px; border-radius: 2px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.25s;
  }
  .sb-anon.on  .sb-anon-icon { background: rgba(180,83,9,0.10); }
  .sb-anon.off .sb-anon-icon { background: rgba(1,145,69,0.07); }
  .sb-anon-title { font-size: 13px; font-weight: 700; color: #0A0F0D; margin: 0 0 2px; }
  .sb-anon-sub   { font-size: 11px; color: #6B7B73; margin: 0; }

  /* Toggle switch */
  .sb-toggle { position: relative; display: inline-flex; align-items: center; cursor: pointer; flex-shrink: 0; }
  .sb-toggle input { position: absolute; opacity: 0; width: 0; height: 0; }
  .sb-toggle-track {
    width: 44px; height: 24px; border-radius: 12px;
    background: rgba(1,145,69,0.12); border: 1px solid rgba(1,145,69,0.20);
    position: relative; transition: background 0.25s, border-color 0.25s;
  }
  .sb-toggle input:checked ~ .sb-toggle-track { background: #B45309; border-color: #B45309; }
  .sb-toggle-thumb {
    position: absolute; top: 2px; left: 2px;
    width: 18px; height: 18px; border-radius: 50%; background: #fff;
    box-shadow: 0 1px 4px rgba(0,0,0,0.20);
    transition: transform 0.25s;
  }
  .sb-toggle input:checked ~ .sb-toggle-track .sb-toggle-thumb { transform: translateX(20px); }

  /* ── Existing media ── */
  .sb-media-item {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 14px; border: 1px solid rgba(1,145,69,0.10);
    border-radius: 2px; background: #FAFAF8;
  }
  .sb-media-icon {
    width: 38px; height: 38px; border-radius: 2px; flex-shrink: 0;
    border: 1px solid rgba(1,145,69,0.12); overflow: hidden;
    display: flex; align-items: center; justify-content: center; background: #fff;
  }
  .sb-media-name { font-size: 12px; font-weight: 600; color: #0A0F0D; margin: 0 0 2px; }
  .sb-media-type { font-size: 10px; color: #9AA8A0; text-transform: uppercase; letter-spacing: 0.08em; margin: 0; }

  /* Media type chips */
  .sb-type-chips { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
  .sb-type-chip {
    display: flex; align-items: center; gap: 8px;
    padding: 11px 14px; border-radius: 2px;
    font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
    border: 1px solid;
  }

  /* Warning banner */
  .sb-warning {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 14px 16px; border-radius: 2px;
    border: 1px solid rgba(180,83,9,0.18);
    background: rgba(180,83,9,0.04);
    font-size: 12px; color: rgba(180,83,9,0.90); line-height: 1.7;
  }

  /* ── Review rows ── */
  .sb-review-row {
    padding: 16px 18px; border-radius: 2px;
    border: 1px solid rgba(1,145,69,0.08);
    background: #FAFAF8;
  }
  .sb-review-label {
    font-size: 9px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase;
    color: #9AA8A0; margin: 0 0 5px;
  }
  .sb-review-value { font-size: 13px; font-weight: 600; color: #0A0F0D; margin: 0; line-height: 1.6; }
  .sb-review-empty { font-size: 13px; color: #C4CEC8; font-style: italic; font-weight: 400; }

  /* Progress bar */
  .sb-progress-track {
    height: 4px; border-radius: 2px; background: rgba(1,145,69,0.10); overflow: hidden; margin-top: 8px;
  }
  .sb-progress-fill {
    height: 100%; border-radius: 2px; background: #019145;
    transition: width 0.3s ease;
  }

  /* Info banner */
  .sb-info {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 14px 16px; border-radius: 2px;
    border: 1px solid rgba(1,145,69,0.15);
    background: rgba(1,145,69,0.04);
    font-size: 12px; color: rgba(1,100,50,0.90); line-height: 1.7;
  }

  /* ── Navigation footer ── */
  .sb-card-foot {
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 28px;
    border-top: 1px solid rgba(1,145,69,0.08);
    background: #FAFAF8;
  }

  .sb-btn-back {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 10px 20px; border-radius: 2px;
    background: transparent; color: #3A4A42;
    font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase;
    border: 1px solid rgba(1,145,69,0.18); cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
  }
  .sb-btn-back:hover { border-color: rgba(1,145,69,0.35); background: rgba(1,145,69,0.04); }
  .sb-btn-back:disabled { opacity: 0.5; cursor: not-allowed; }

  .sb-btn-next {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 24px; border-radius: 2px;
    background: #019145; color: #fff;
    font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase;
    border: none; cursor: pointer;
    transition: background 0.2s, transform 0.15s;
    box-shadow: 0 4px 16px rgba(1,145,69,0.25);
  }
  .sb-btn-next:hover:not(:disabled) { background: #016934; transform: translateY(-1px); }
  .sb-btn-next:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

  /* Loading state */
  .sb-loading {
    display: flex; align-items: center; justify-content: center;
    min-height: calc(100vh - 64px);
    background: #F7F5F0;
  }
`;

const STEPS_NEW = [
  { label: "Details", desc: "Incident information" },
  { label: "Media", desc: "Upload evidence" },
  { label: "Review", desc: "Confirm & submit" },
];
const STEPS_EDIT = [
  { label: "Details", desc: "Update information" },
  { label: "Media", desc: "Update evidence" },
  { label: "Review", desc: "Confirm & resubmit" },
];

export default function Submit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingPost, setLoadingPost] = useState(false);
  const [existingMedia, setExistingMedia] = useState([]);
  const [adminFeedback, setAdminFeedback] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    incidentDate: "",
    tags: "",
    isAnonymous: false,
  });
  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  useEffect(() => {
    if (!isEditing) return;
    setLoadingPost(true);
    api
      .get(`/posts/${id}/owner`)
      .then(({ data }) => {
        const post = data.data;
        if (post.status !== "rejected") {
          toast.error("Only rejected posts can be updated.");
          navigate("/dashboard");
          return;
        }
        setForm({
          title: post.title || "",
          description: post.description || "",
          location: post.location || "",
          incidentDate: post.incidentDate
            ? new Date(post.incidentDate).toISOString().split("T")[0]
            : "",
          tags: Array.isArray(post.tags)
            ? post.tags.join(", ")
            : post.tags || "",
          isAnonymous: post.isAnonymous || false,
        });
        setExistingMedia(post.media || []);
        setAdminFeedback(post.rejectionReason || "");
      })
      .catch((err) => {
        toast.error(
          err.response?.data?.message || "Failed to load the rejected post",
        );
        navigate("/dashboard");
      })
      .finally(() => setLoadingPost(false));
  }, [id, isEditing, navigate]);

  const validateStep = () => {
    if (step === 0) {
      if (!form.title.trim()) {
        toast.error("Title is required");
        return false;
      }
      if (!form.description.trim()) {
        toast.error("Description is required");
        return false;
      }
      if (!form.location.trim()) {
        toast.error("Location is required");
        return false;
      }
      if (!form.incidentDate) {
        toast.error("Incident date is required");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) setStep((s) => s + 1);
  };
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title.trim());
      fd.append("description", form.description.trim());
      fd.append("location", form.location.trim());
      fd.append("incidentDate", form.incidentDate);
      fd.append("isAnonymous", form.isAnonymous);
      if (form.tags.trim()) fd.append("tags", form.tags);
      files.forEach((f) => fd.append("media", f));
      const endpoint = isEditing ? `/posts/${id}` : "/posts";
      const method = isEditing ? api.put : api.post;
      await method(endpoint, fd, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) =>
          setProgress(Math.round((e.loaded * 100) / e.total)),
      });
      toast.success(
        isEditing
          ? "Update submitted for review."
          : "Report submitted! Reviewed within 24 hours.",
      );
      navigate(isEditing ? "/dashboard" : "/");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Submission failed. Please try again.",
      );
    } finally {
      setSubmitting(false);
      setProgress(0);
    }
  };

  const steps = isEditing ? STEPS_EDIT : STEPS_NEW;

  if (loadingPost)
    return (
      <div className="sb-root">
        <style>{css}</style>
        <div className="sb-loading">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );

  return (
    <div className="sb-root">
      <style>{css}</style>

      {/* ══ PAGE HEADER ══ */}
      <div className="sb-header">
        <div className="sb-header-grid" />
        <div className="sb-header-glow" />
        <div className="sb-header-inner">
          <div className="sb-header-icon">
            <Upload size={20} color="#fff" />
          </div>
          <div>
            <div className="sb-eyebrow">
              {isEditing ? "Update Report" : "Submit Evidence"}
            </div>
            <h1 className="sb-header-h1">
              {isEditing ? "Update Your Report" : "Submit Evidence"}
            </h1>
            <p className="sb-header-sub">
              {isEditing
                ? "Update your rejected report and resubmit it for review."
                : "Your submission will be reviewed by our team before going live."}
            </p>
          </div>
        </div>
      </div>

      <div className="sb-body">
        {/* Admin feedback */}
        {isEditing && adminFeedback && (
          <div className="sb-feedback">
            <AlertTriangle
              size={15}
              color="#DC2626"
              style={{ flexShrink: 0, marginTop: 1 }}
            />
            <div>
              <p className="sb-feedback-label">Admin Feedback</p>
              <p className="sb-feedback-text">{adminFeedback}</p>
            </div>
          </div>
        )}

        {/* ── Stepper ── */}
        <div className="sb-stepper">
          {steps.map((s, i) => (
            <>
              <div key={s.label} className="sb-step">
                <div
                  className={`sb-step-circle ${i < step ? "done" : i === step ? "active" : "idle"}`}
                >
                  {i < step ? <CheckCircle size={15} /> : i + 1}
                </div>
                <p
                  className={`sb-step-label ${i < step ? "done" : i === step ? "active" : "idle"}`}
                >
                  {s.label}
                </p>
                <p className="sb-step-desc">{s.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div
                  key={`conn-${i}`}
                  className={`sb-step-connector ${i < step ? "done" : "idle"}`}
                />
              )}
            </>
          ))}
        </div>

        {/* ── Card ── */}
        <div className="sb-card">
          {/* Card head */}
          <div className="sb-card-head">
            <div className="sb-card-head-num">{step + 1}</div>
            <div>
              <p className="sb-card-head-title">{steps[step].label}</p>
              <p className="sb-card-head-desc">{steps[step].desc}</p>
            </div>
          </div>

          <div className="sb-card-body">
            {/* ── STEP 0: Details ── */}
            {step === 0 && (
              <div>
                <div className="sb-field">
                  <label className="sb-label">
                    Title <span className="sb-req">*</span>
                  </label>
                  <input
                    type="text"
                    className="sb-input"
                    placeholder="e.g. Police officer accepting bribe at checkpoint"
                    value={form.title}
                    onChange={(e) => update("title", e.target.value)}
                    maxLength={200}
                  />
                  <p className="sb-char-count">{form.title.length} / 200</p>
                </div>

                <div className="sb-field">
                  <label className="sb-label">
                    Description <span className="sb-req">*</span>
                  </label>
                  <textarea
                    rows={5}
                    className="sb-input"
                    placeholder="Describe what happened in detail. Include context, persons involved, and any relevant information…"
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                    maxLength={5000}
                  />
                  <p className="sb-char-count">
                    {form.description.length} / 5000
                  </p>
                </div>

                <div className="sb-grid2" style={{ marginBottom: 22 }}>
                  <div>
                    <label className="sb-label">
                      <MapPin size={11} color="#9AA8A0" />
                      Location <span className="sb-req">*</span>
                    </label>
                    <input
                      type="text"
                      className="sb-input"
                      placeholder="e.g. Dhaka, Dhaka"
                      value={form.location}
                      onChange={(e) => update("location", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="sb-label">
                      <Calendar size={11} color="#9AA8A0" />
                      Incident Date <span className="sb-req">*</span>
                    </label>
                    <input
                      type="date"
                      className="sb-input"
                      value={form.incidentDate}
                      onChange={(e) => update("incidentDate", e.target.value)}
                      max={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>

                <div className="sb-field">
                  <label className="sb-label">
                    <Tag size={11} color="#9AA8A0" />
                    Tags <span className="sb-opt">(optional)</span>
                  </label>
                  <input
                    type="text"
                    className="sb-input"
                    placeholder="e.g. police, bribery, government (comma separated)"
                    value={form.tags}
                    onChange={(e) => update("tags", e.target.value)}
                  />
                </div>

                {/* Anonymous toggle */}
                <div className={`sb-anon ${form.isAnonymous ? "on" : "off"}`}>
                  <div className="sb-anon-icon">
                    <UserX
                      size={18}
                      color={form.isAnonymous ? "#B45309" : "#019145"}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p className="sb-anon-title">Anonymous Submission</p>
                    <p className="sb-anon-sub">
                      Your name will be hidden from the public view.
                    </p>
                  </div>
                  <label className="sb-toggle">
                    <input
                      type="checkbox"
                      checked={form.isAnonymous}
                      onChange={(e) => update("isAnonymous", e.target.checked)}
                    />
                    <div className="sb-toggle-track">
                      <div className="sb-toggle-thumb" />
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* ── STEP 1: Media ── */}
            {step === 1 && (
              <div>
                {isEditing && existingMedia.length > 0 && (
                  <div style={{ marginBottom: 20 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 10,
                      }}
                    >
                      <p
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: "0.10em",
                          textTransform: "uppercase",
                          color: "#3A4A42",
                          margin: 0,
                        }}
                      >
                        Current Attachments
                      </p>
                      <span style={{ fontSize: 10, color: "#9AA8A0" }}>
                        Upload new files to replace
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      {existingMedia.map((m, i) => {
                        const Icon =
                          m.type === "video"
                            ? Film
                            : m.type === "pdf"
                              ? FileText
                              : Image;
                        return (
                          <div key={`${m.url}-${i}`} className="sb-media-item">
                            <div className="sb-media-icon">
                              {m.type === "image" ? (
                                <img
                                  src={m.url}
                                  alt=""
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                              ) : (
                                <Icon size={16} color="#6B7B73" />
                              )}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p className="sb-media-name">
                                {m.filename || "Attachment"}
                              </p>
                              <p className="sb-media-type">{m.type}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <DragDropUpload files={files} onChange={setFiles} />

                {files.length === 0 && (
                  <div className="sb-warning" style={{ marginTop: 14 }}>
                    <AlertTriangle
                      size={14}
                      color="#B45309"
                      style={{ flexShrink: 0, marginTop: 1 }}
                    />
                    <span>
                      Media is optional but strongly recommended. Strong
                      evidence increases report credibility and approval speed.
                    </span>
                  </div>
                )}

                <div className="sb-type-chips" style={{ marginTop: 14 }}>
                  {[
                    {
                      icon: Image,
                      label: "Images",
                      bg: "rgba(14,165,233,0.06)",
                      border: "rgba(14,165,233,0.20)",
                      color: "#0369A1",
                    },
                    {
                      icon: Film,
                      label: "Videos",
                      bg: "rgba(139,92,246,0.06)",
                      border: "rgba(139,92,246,0.20)",
                      color: "#7C3AED",
                    },
                    {
                      icon: FileText,
                      label: "PDFs",
                      bg: "rgba(180,83,9,0.06)",
                      border: "rgba(180,83,9,0.18)",
                      color: "#B45309",
                    },
                  ].map(({ icon: Icon, label, bg, border, color }) => (
                    <div
                      key={label}
                      className="sb-type-chip"
                      style={{ background: bg, borderColor: border, color }}
                    >
                      <Icon size={13} /> {label}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── STEP 2: Review ── */}
            {step === 2 && (
              <div>
                <div style={{ display: "grid", gap: 10, marginBottom: 20 }}>
                  <ReviewRow label="Title" value={form.title} />
                  <ReviewRow
                    label="Description"
                    value={form.description}
                    multiline
                  />
                  <div className="sb-grid2">
                    <ReviewRow label="Location" value={form.location} />
                    <ReviewRow
                      label="Incident Date"
                      value={form.incidentDate}
                    />
                  </div>
                  <div className="sb-grid2">
                    <ReviewRow
                      label="Media Files"
                      value={`${files.length} file(s) attached`}
                    />
                    <ReviewRow
                      label="Identity"
                      value={form.isAnonymous ? "Anonymous" : "Public"}
                      valueColor={form.isAnonymous ? "#B45309" : undefined}
                    />
                  </div>
                  {form.tags && <ReviewRow label="Tags" value={form.tags} />}
                </div>

                {submitting && (
                  <div style={{ marginBottom: 18 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 11,
                        color: "#6B7B73",
                        marginBottom: 6,
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>
                        Uploading evidence…
                      </span>
                      <span>{progress}%</span>
                    </div>
                    <div className="sb-progress-track">
                      <div
                        className="sb-progress-fill"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="sb-info">
                  <CheckCircle
                    size={14}
                    color="#019145"
                    style={{ flexShrink: 0, marginTop: 1 }}
                  />
                  <span>
                    {isEditing
                      ? "Your update will be reviewed again before it is made public."
                      : "Your report will be reviewed by our team before it is made public. This usually takes less than 24 hours."}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* ── Navigation ── */}
          <div className="sb-card-foot">
            {step > 0 ? (
              <button
                className="sb-btn-back"
                onClick={() => setStep((s) => s - 1)}
                disabled={submitting}
              >
                ← Back
              </button>
            ) : (
              <div />
            )}

            {step < steps.length - 1 ? (
              <button className="sb-btn-next" onClick={handleNext}>
                Continue → {steps[step + 1].label}
              </button>
            ) : (
              <button
                className="sb-btn-next"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <LoadingSpinner size="sm" /> Submitting…
                  </>
                ) : (
                  <>
                    <Upload size={14} />{" "}
                    {isEditing ? "Resubmit Report" : "Submit Report"}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewRow({ label, value, multiline, valueColor }) {
  return (
    <div className="sb-review-row">
      <p className="sb-review-label">{label}</p>
      {value ? (
        <p
          className="sb-review-value"
          style={{
            color: valueColor || "#0A0F0D",
            WebkitLineClamp: multiline ? 3 : undefined,
            display: multiline ? "-webkit-box" : undefined,
            WebkitBoxOrient: multiline ? "vertical" : undefined,
            overflow: multiline ? "hidden" : undefined,
          }}
        >
          {value}
        </p>
      ) : (
        <p className="sb-review-empty">Not provided</p>
      )}
    </div>
  );
}
