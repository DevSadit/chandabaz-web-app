import { forwardRef } from "react";
import { format } from "date-fns";

/**
 * BribeReceipt — off-screen PDF template styled to mirror the ChandaBaz site UI.
 * Uses the exact same design tokens, card system, header pattern, and typography
 * as the live frontend. Captured by html2canvas → exported via jsPDF.
 */
const BribeReceipt = forwardRef(function BribeReceipt({ post }, ref) {
  if (!post) return null;

  // Prefer the server-issued receiptId (set on approval); fall back to hash for legacy posts
  const receiptNo =
    post.receiptId || `CB-${(post._id || "").slice(-8).toUpperCase()}`;
  const issuedDate = format(new Date(), "dd MMMM yyyy");
  const incidentDate = post.incidentDate
    ? format(new Date(post.incidentDate), "dd MMMM yyyy")
    : "Not Specified";
  const reportedBy = post.isAnonymous
    ? "Anonymous Citizen"
    : post.author?.name || "Unknown Reporter";
  const desc =
    post.description?.length > 290
      ? post.description.slice(0, 290) + "…"
      : post.description || "";

  // ── ChandaBaz design tokens (exact values from the live site) ────────────
  const C = {
    dark: "#0A0F0D",
    green: "#019145",
    greenBg: "rgba(1,145,69,0.08)",
    greenBd: "rgba(1,145,69,0.10)",
    greenBdMd: "rgba(1,145,69,0.20)",
    bg: "#F7F5F0",
    card: "#fff",
    headBg: "#FAFAF8",
    textDk: "#0A0F0D",
    textMd: "#3A4A42",
    textMt: "#6B7B73",
    textFt: "#9AA8A0",
    amber: "#B45309",
    amberBg: "rgba(180,83,9,0.06)",
    amberBd: "rgba(180,83,9,0.18)",
    serif: "'Playfair Display', Georgia, 'Times New Roman', serif",
    sans: "'DM Sans', Arial, Helvetica, sans-serif",
    mono: '"Courier New", Courier, monospace',
  };

  // ── All styles inline — required for html2canvas ─────────────────────────
  const S = {
    wrap: {
      position: "absolute",
      left: "-9999px",
      top: 0,
      zIndex: -1,
      pointerEvents: "none",
    },
    page: {
      width: "794px",
      background: C.bg,
      fontFamily: C.sans,
      color: C.textDk,
      boxSizing: "border-box",
      position: "relative",
      overflow: "hidden",
    },
    watermark: {
      position: "absolute",
      top: "46%",
      left: "50%",
      transform: "translate(-50%, -50%) rotate(-28deg)",
      width: "370px",
      opacity: 0.035,
      pointerEvents: "none",
      zIndex: 0,
    },
    content: { position: "relative", zIndex: 1 },

    /* ══ HEADER — mirrors ud-header ══ */
    header: {
      background: C.dark,
      position: "relative",
      overflow: "hidden",
      borderBottom: "1px solid rgba(1,145,69,0.15)",
    },
    hTopLine: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "1px",
      background:
        "linear-gradient(90deg, transparent, rgba(1,145,69,0.55), transparent)",
    },
    hGrid: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      backgroundImage:
        "linear-gradient(rgba(1,145,69,0.04) 1px, transparent 1px)," +
        "linear-gradient(90deg, rgba(1,145,69,0.04) 1px, transparent 1px)",
      backgroundSize: "48px 48px",
    },
    hGlow: {
      position: "absolute",
      top: "-60%",
      right: "-5%",
      width: "500px",
      height: "400px",
      background:
        "radial-gradient(circle, rgba(1,145,69,0.14) 0%, transparent 65%)",
      filter: "blur(60px)",
      pointerEvents: "none",
    },
    hInner: {
      padding: "22px 32px",
      position: "relative",
      zIndex: 2,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "16px",
    },
    hLeft: { display: "flex", alignItems: "flex-start", gap: "14px" },
    hIconBox: {
      width: "44px",
      height: "44px",
      borderRadius: "2px",
      background: C.green,
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 4px 20px rgba(1,145,69,0.30)",
      overflow: "hidden",
    },
    hLogo: { width: "34px", height: "34px", objectFit: "contain" },
    hEyebrow: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      marginBottom: "5px",
    },
    hEyebrowLine: {
      width: "14px",
      height: "1px",
      background: C.green,
      opacity: 0.4,
    },
    hEyebrowText: {
      fontSize: "9px",
      fontWeight: 700,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: C.green,
      fontFamily: C.sans,
    },
    hOrgName: {
      fontFamily: C.serif,
      fontSize: "22px",
      fontWeight: 800,
      color: "#fff",
      letterSpacing: "-0.02em",
      margin: "0 0 4px",
    },
    hOrgSub: {
      fontSize: "12px",
      color: "rgba(255,255,255,0.38)",
      margin: 0,
      fontFamily: C.sans,
    },
    hRight: { textAlign: "right" },
    hGovtEye: {
      display: "block",
      fontSize: "8.5px",
      fontWeight: 700,
      color: "rgba(255,255,255,0.28)",
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      margin: "0 0 4px",
      fontFamily: C.sans,
    },
    hGovtMain: {
      display: "block",
      fontSize: "12px",
      fontWeight: 700,
      color: "rgba(255,255,255,0.60)",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      margin: "0 0 2px",
      fontFamily: C.sans,
    },
    hGovtSub: {
      display: "block",
      fontSize: "8.5px",
      color: "rgba(255,255,255,0.25)",
      letterSpacing: "0.04em",
      margin: 0,
      fontFamily: C.sans,
    },

    /* ══ TITLE SECTION ══ */
    titleSection: {
      padding: "22px 32px 20px",
      background: C.card,
      borderBottom: `1px solid ${C.greenBd}`,
    },
    eyebrow: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      marginBottom: "8px",
    },
    eyebrowLine: {
      width: "14px",
      height: "1px",
      background: C.green,
      opacity: 0.4,
    },
    eyebrowText: {
      fontSize: "9px",
      fontWeight: 700,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: C.green,
      fontFamily: C.sans,
    },
    h1: {
      fontFamily: C.serif,
      fontSize: "30px",
      fontWeight: 800,
      color: C.textDk,
      letterSpacing: "-0.02em",
      lineHeight: 1.15,
      margin: "0 0 5px",
    },
    h1Sub: { fontSize: "12px", color: C.textMt, fontFamily: C.sans, margin: 0 },

    /* ══ STATS ROW — mirrors ud-stats ══ */
    statsWrap: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "12px",
      padding: "16px 32px",
      background: C.bg,
    },
    statCard: {
      padding: "16px 16px",
      background: C.card,
      border: `1px solid ${C.greenBd}`,
      borderRadius: "2px",
      display: "flex",
      alignItems: "flex-start",
      gap: "12px",
    },
    statIconBox: {
      width: "36px",
      height: "36px",
      borderRadius: "2px",
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    statIconText: { fontSize: "14px", lineHeight: 1 },
    statTexts: { display: "flex", flexDirection: "column", gap: "3px" },
    statValue: {
      fontFamily: C.serif,
      fontSize: "14px",
      fontWeight: 800,
      color: C.textDk,
      lineHeight: 1,
      margin: 0,
    },
    statValueGreen: {
      fontFamily: C.sans,
      fontSize: "12px",
      fontWeight: 700,
      color: C.green,
      lineHeight: 1,
      margin: 0,
    },
    statValueMono: {
      fontFamily: C.mono,
      fontSize: "7.5px",
      fontWeight: 700,
      color: C.textMd,
      lineHeight: 1.35,
      margin: 0,
      wordBreak: "break-all",
    },
    statLabel: {
      fontSize: "9px",
      fontWeight: 700,
      letterSpacing: "0.10em",
      textTransform: "uppercase",
      color: C.textFt,
      margin: 0,
      fontFamily: C.sans,
    },

    /* ══ BODY ══ */
    body: { padding: "16px 32px 0" },
    card: {
      background: C.card,
      border: `1px solid ${C.greenBd}`,
      borderRadius: "2px",
      overflow: "hidden",
      marginBottom: "14px",
    },
    cardHead: {
      padding: "12px 20px",
      borderBottom: `1px solid ${C.greenBd}`,
      background: C.headBg,
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    cardHeadBar: {
      width: "3px",
      height: "18px",
      borderRadius: "1px",
      background: C.green,
      flexShrink: 0,
    },
    cardHeadTitle: {
      fontSize: "12px",
      fontWeight: 700,
      color: C.textDk,
      margin: 0,
      fontFamily: C.sans,
    },
    cardHeadSub: {
      fontSize: "10px",
      color: C.textFt,
      margin: "1px 0 0",
      fontFamily: C.sans,
    },
    table: { width: "100%", borderCollapse: "collapse" },
    tdLabel: {
      padding: "10px 18px",
      fontSize: "9px",
      fontWeight: 700,
      letterSpacing: "0.10em",
      textTransform: "uppercase",
      color: C.textMd,
      background: C.headBg,
      borderBottom: `1px solid ${C.greenBd}`,
      borderRight: `1px solid ${C.greenBd}`,
      width: "32%",
      verticalAlign: "top",
      fontFamily: C.sans,
    },
    td: {
      padding: "10px 18px",
      fontSize: "12.5px",
      color: C.textDk,
      borderBottom: `1px solid ${C.greenBd}`,
      verticalAlign: "top",
      background: C.card,
      fontFamily: C.sans,
    },
    tdGreen: {
      padding: "10px 18px",
      fontSize: "12.5px",
      fontWeight: 700,
      color: C.green,
      borderBottom: `1px solid ${C.greenBd}`,
      verticalAlign: "top",
      background: C.card,
      fontFamily: C.sans,
    },
    descText: {
      fontSize: "12.5px",
      color: C.textMd,
      lineHeight: 1.8,
      margin: 0,
      padding: "16px 20px",
      fontFamily: C.sans,
    },

    /* ══ SIGNATURE CARD ══ */
    sigCard: {
      background: C.card,
      border: `1px solid ${C.greenBd}`,
      borderRadius: "2px",
      overflow: "hidden",
      marginBottom: "14px",
    },
    sigCardBody: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "20px 28px",
    },
    stamp: {
      width: "106px",
      height: "106px",
      borderRadius: "50%",
      border: "3px solid rgba(220,38,38,0.58)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "10px",
      transform: "rotate(-12deg)",
      flexShrink: 0,
    },
    stampText: {
      fontSize: "7.5px",
      fontWeight: 700,
      color: "rgba(220,38,38,0.65)",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      lineHeight: 1.35,
      fontFamily: C.sans,
    },
    stampMark: {
      fontSize: "26px",
      color: "rgba(220,38,38,0.65)",
      lineHeight: 1,
      margin: "3px 0",
    },
    stampDate: {
      fontSize: "6.5px",
      color: "rgba(220,38,38,0.42)",
      fontFamily: C.sans,
      marginTop: "4px",
    },
    sigRight: { textAlign: "right" },
    sigHint: {
      fontSize: "9px",
      color: C.textFt,
      letterSpacing: "0.08em",
      margin: "0 0 8px",
      fontFamily: C.sans,
    },
    sigLine: {
      width: "186px",
      height: "1px",
      background: C.greenBdMd,
      marginLeft: "auto",
      marginBottom: "6px",
    },
    sigName: {
      fontSize: "11px",
      fontWeight: 700,
      color: C.textDk,
      margin: "0 0 2px",
      fontFamily: C.sans,
    },
    sigTitle: {
      fontSize: "9px",
      color: C.textMt,
      letterSpacing: "0.05em",
      margin: 0,
      fontFamily: C.sans,
    },

    /* ══ DISCLAIMER ══ */
    disclaimer: {
      background: C.amberBg,
      border: `1px solid ${C.amberBd}`,
      borderRadius: "2px",
      padding: "10px 16px",
      display: "flex",
      alignItems: "flex-start",
      gap: "10px",
      margin: "0 32px 16px",
    },
    disclaimerIcon: {
      fontSize: "13px",
      color: C.amber,
      flexShrink: 0,
      lineHeight: "1.6",
    },
    disclaimerText: {
      fontSize: "10px",
      color: C.amber,
      lineHeight: 1.65,
      margin: 0,
      fontFamily: C.sans,
    },

    /* ══ FOOTER ══ */
    footer: {
      background: C.dark,
      padding: "12px 32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderTop: "1px solid rgba(1,145,69,0.15)",
    },
    footerText: {
      fontSize: "9px",
      color: "rgba(255,255,255,0.35)",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      fontFamily: C.sans,
    },
    footerGreen: {
      fontSize: "9px",
      fontWeight: 700,
      color: C.green,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      fontFamily: C.sans,
    },
  };

  const tableRows = [
    ["Incident Title", post.title, false],
    ["Location", post.location, false],
    ["Date of Incident", incidentDate, false],
    ["Reported By", reportedBy, false],
    ["Evidence Files", `${post.media?.length || 0} file(s) attached`, false],
    ["Report Status", "✓  Verified & Approved", true],
  ];

  return (
    <div style={S.wrap}>
      <div ref={ref} style={S.page}>
        {/* diagonal logo watermark */}
        <img
          src="/Chandabaz_logo.png"
          alt=""
          style={S.watermark}
          crossOrigin="anonymous"
        />

        <div style={S.content}>
          {/* ══ HEADER ══ */}
          <div style={S.header}>
            <div style={S.hTopLine} />
            <div style={S.hGrid} />
            <div style={S.hGlow} />
            <div style={S.hInner}>
              <div style={S.hLeft}>
                <div style={S.hIconBox}>
                  <img
                    src="/Chandabaz_logo.png"
                    alt="ChandaBaz"
                    style={S.hLogo}
                    crossOrigin="anonymous"
                  />
                </div>
                <div>
                  <div style={S.hEyebrow}>
                    <div style={S.hEyebrowLine} />
                    <span style={S.hEyebrowText}>Corruption Report</span>
                    <div style={S.hEyebrowLine} />
                  </div>
                  <p style={S.hOrgName}>ChandaBaz</p>
                  <p style={S.hOrgSub}>
                    Track your submissions and manage your account
                  </p>
                </div>
              </div>
              <div style={S.hRight}>
                <span style={S.hGovtEye}>✦ Republic of BANGLADESH ✦</span>
              </div>
            </div>
          </div>

          {/* ══ TITLE ══ */}
          <div style={S.titleSection}>
            <div style={S.eyebrow}>
              <div style={S.eyebrowLine} />
              <span style={S.eyebrowText}>Official Document</span>
              <div style={S.eyebrowLine} />
            </div>
            <h1 style={S.h1}>Receipt of Dishonesty</h1>
            <p style={S.h1Sub}>
              A satirical acknowledgement of a verified act of corruption
            </p>
          </div>

          {/* ══ STATS ROW ══ */}
          <div style={S.statsWrap}>
            <div style={S.statCard}>
              <div style={{ ...S.statIconBox, background: C.greenBg }}>
                <span style={{ ...S.statIconText, color: C.green }}>⊞</span>
              </div>
              <div style={S.statTexts}>
                <p style={S.statValue}>{receiptNo}</p>
                <p style={S.statLabel}>Receipt No.</p>
              </div>
            </div>
            <div style={S.statCard}>
              <div style={{ ...S.statIconBox, background: C.greenBg }}>
                <span style={{ ...S.statIconText, color: C.green }}>✓</span>
              </div>
              <div style={S.statTexts}>
                <p style={S.statValueGreen}>Verified</p>
                <p style={S.statLabel}>Case Status</p>
              </div>
            </div>
            <div style={S.statCard}>
              <div
                style={{
                  ...S.statIconBox,
                  background: "rgba(14,165,233,0.08)",
                }}
              >
                <span
                  style={{
                    ...S.statIconText,
                    color: "#0369A1",
                    fontSize: "12px",
                  }}
                >
                  ◷
                </span>
              </div>
              <div style={S.statTexts}>
                <p style={{ ...S.statValue, fontSize: "11px" }}>{issuedDate}</p>
                <p style={S.statLabel}>Date Issued</p>
              </div>
            </div>
            <div style={S.statCard}>
              <div style={{ ...S.statIconBox, background: "rgba(0,0,0,0.04)" }}>
                <span
                  style={{
                    ...S.statIconText,
                    color: C.textMt,
                    fontSize: "11px",
                    fontWeight: 700,
                  }}
                >
                  #
                </span>
              </div>
              <div style={S.statTexts}>
                <p style={S.statValueMono}>{post._id}</p>
                <p style={S.statLabel}>Report Ref</p>
              </div>
            </div>
          </div>

          {/* ══ BODY ══ */}
          <div style={S.body}>
            {/* Transaction Particulars */}
            <div style={S.card}>
              <div style={S.cardHead}>
                <div style={S.cardHeadBar} />
                <div>
                  <p style={S.cardHeadTitle}>Transaction Particulars</p>
                  <p style={S.cardHeadSub}>Submitted incident details</p>
                </div>
              </div>
              <table style={S.table}>
                <tbody>
                  {tableRows.map(([label, value, isGreen], i) => (
                    <tr key={i}>
                      <td style={S.tdLabel}>{label}</td>
                      <td style={isGreen ? S.tdGreen : S.td}>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Description */}
            <div style={S.card}>
              <div style={S.cardHead}>
                <div style={S.cardHeadBar} />
                <div>
                  <p style={S.cardHeadTitle}>Description of Incident</p>
                  <p style={S.cardHeadSub}>Full incident description</p>
                </div>
              </div>
              <p style={S.descText}>{desc}</p>
            </div>

            {/* Verification */}
            <div style={S.sigCard}>
              <div style={S.cardHead}>
                <div style={S.cardHeadBar} />
                <p style={S.cardHeadTitle}>Verification &amp; Authorisation</p>
              </div>
              <div style={S.sigCardBody}>
                <div style={S.stamp}>
                  <span style={S.stampText}>Certified</span>
                  <span style={S.stampText}>By</span>
                  <span style={S.stampMark}>✓</span>
                  <span style={S.stampText}>ChandaBaz</span>
                  <span style={S.stampDate}>{issuedDate}</span>
                </div>
                <div style={S.sigRight}>
                  <p style={S.sigHint}>Authorised Digital Signatory</p>
                  <div style={S.sigLine} />
                  <p style={S.sigName}>ChandaBaz Verification Engine</p>
                  <p style={S.sigTitle}>
                    Anti-Corruption Accountability Bureau
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ══ DISCLAIMER ══ */}
          <div style={S.disclaimer}>
            <span style={S.disclaimerIcon}>⚠</span>
            <p style={S.disclaimerText}>
              <strong>Satirical Document:</strong> This receipt is generated by
              ChandaBaz as a humorous acknowledgement of a verified act of
              corruption. It is <strong>not</strong> an official government
              document and carries no legal value. The incident has been
              verified on the ChandaBaz platform.{" "}
              <strong>Receipt ID: {receiptNo}</strong>
            </p>
          </div>

          {/* ══ FOOTER ══ */}
          <div style={S.footer}>
            <span style={S.footerText}>chandabaz</span>
            <span style={S.footerGreen}>
              Protecting Democracy · Fighting Corruption
            </span>
            <span style={S.footerText}>Est. 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default BribeReceipt;

/**
 * Captures the BribeReceipt element, downloads the PDF locally, then uploads
 * the same PDF to Cloudinary via the backend and returns the stored URL.
 * The upload is best-effort — a failure still produces the local download.
 */
export async function downloadReceiptPDF(ref, post) {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ]);

  const element = ref.current;
  if (!element) throw new Error("Receipt element not mounted");

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: false,
    backgroundColor: "#F7F5F0",
    logging: false,
  });

  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pdfW = pdf.internal.pageSize.getWidth();
  const pdfH = pdf.internal.pageSize.getHeight();
  const imgAspect = canvas.height / canvas.width;
  const renderH = pdfW * imgAspect;

  if (renderH <= pdfH) {
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, pdfW, renderH);
  } else {
    const scale = pdfH / renderH;
    pdf.addImage(
      canvas.toDataURL("image/png"),
      "PNG",
      0,
      0,
      pdfW * scale,
      pdfH,
    );
  }

  // Grab the PDF data before triggering download so we can upload the same bytes
  const pdfDataUri = pdf.output("datauristring");

  // ── 1. Trigger local download ──────────────────────────────────────────
  pdf.save(`receipt-of-dishonesty-${(post._id || "report").slice(-8)}.pdf`);

  // ── 2. Upload to Cloudinary via backend (best-effort) ──────────────────
  let receiptUrl = post.receiptUrl || null;
  if (post._id && localStorage.getItem("cb_token")) {
    try {
      const { default: api } = await import("../services/api");
      const { data } = await api.post(`/posts/${post._id}/receipt`, {
        receiptData: pdfDataUri,
      });
      receiptUrl = data?.data?.receiptUrl || null;
    } catch {
      // Upload failed — local download already succeeded, so silently ignore
    }
  }

  return receiptUrl; // callers can update their local post state
}
