import { forwardRef } from "react";
import { format } from "date-fns";

/**
 * BribeReceipt — redesigned PDF template.
 * Professional, document-grade layout inspired by official government receipts,
 * legal certificates, and banking documents. Clean serif typography,
 * authoritative structure, high contrast, easy scanability.
 */
const BribeReceipt = forwardRef(function BribeReceipt({ post }, ref) {
  if (!post) return null;

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

  // ── Design tokens ────────────────────────────────────────────────────────
  const C = {
    ink: "#0D1117",
    inkMid: "#374151",
    inkLight: "#6B7280",
    inkFaint: "#9CA3AF",
    green: "#016B35",
    greenMid: "#019145",
    greenLight: "#D1FAE5",
    greenBorder: "#A7F3D0",
    page: "#FFFFFF",
    offWhite: "#F9FAFB",
    border: "#E5E7EB",
    borderMid: "#D1D5DB",
    red: "#B91C1C",
    redLight: "#FEF2F2",
    amber: "#92400E",
    amberLight: "#FFFBEB",
    amberBorder: "#FDE68A",
    headerBg: "#0D1117",
    serif: "'Georgia', 'Times New Roman', serif",
    sans: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    mono: '"Courier New", Courier, monospace',
  };

  const S = {
    // Off-screen wrapper
    wrap: {
      position: "absolute",
      left: "-9999px",
      top: 0,
      zIndex: -1,
      pointerEvents: "none",
    },

    // Page
    page: {
      width: "794px",
      minHeight: "1123px",
      background: C.page,
      fontFamily: C.sans,
      color: C.ink,
      boxSizing: "border-box",
      position: "relative",
    },

    // ── TOP SECURITY BAND ──────────────────────────────────────────────────
    securityBand: {
      height: "6px",
      background: `repeating-linear-gradient(
        90deg,
        ${C.green} 0px,
        ${C.green} 20px,
        ${C.greenMid} 20px,
        ${C.greenMid} 40px,
        #01A852 40px,
        #01A852 60px
      )`,
    },

    // ── HEADER ─────────────────────────────────────────────────────────────
    header: {
      background: C.headerBg,
      padding: "0",
    },
    headerInner: {
      display: "flex",
      alignItems: "stretch",
      minHeight: "100px",
    },
    headerGreenAccent: {
      width: "6px",
      background: C.greenMid,
      flexShrink: 0,
    },
    headerContent: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "24px 36px",
    },
    headerLeft: {
      display: "flex",
      alignItems: "center",
      gap: "18px",
    },
    logoBox: {
      width: "56px",
      height: "56px",
      background: C.greenMid,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      borderRadius: "4px",
    },
    logoImg: { width: "42px", height: "42px", objectFit: "contain" },
    orgBlock: {},
    orgEyebrow: {
      fontSize: "8px",
      fontWeight: 700,
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      color: C.greenMid,
      fontFamily: C.sans,
      marginBottom: "4px",
    },
    orgName: {
      fontFamily: C.serif,
      fontSize: "26px",
      fontWeight: 700,
      color: "#FFFFFF",
      margin: "0 0 3px",
      letterSpacing: "-0.01em",
    },
    orgTagline: {
      fontSize: "11px",
      color: "rgba(255,255,255,0.45)",
      margin: 0,
      fontFamily: C.sans,
    },
    headerRight: {
      textAlign: "right",
    },
    headerBadge: {
      display: "inline-flex",
      flexDirection: "column",
      alignItems: "flex-end",
      gap: "3px",
    },
    headerBadgeTop: {
      fontSize: "7.5px",
      fontWeight: 700,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: "rgba(255,255,255,0.3)",
      fontFamily: C.sans,
    },
    headerBadgeMid: {
      fontSize: "13px",
      fontWeight: 700,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: "rgba(255,255,255,0.65)",
      fontFamily: C.sans,
    },
    headerBadgeBot: {
      fontSize: "8px",
      letterSpacing: "0.06em",
      color: "rgba(255,255,255,0.25)",
      fontFamily: C.sans,
    },

    // ── DOCUMENT TITLE STRIP ───────────────────────────────────────────────
    titleStrip: {
      borderBottom: `3px solid ${C.green}`,
      padding: "20px 42px 18px",
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      background: C.offWhite,
    },
    titleLeft: {},
    docType: {
      fontSize: "8.5px",
      fontWeight: 700,
      letterSpacing: "0.22em",
      textTransform: "uppercase",
      color: C.green,
      marginBottom: "5px",
      fontFamily: C.sans,
    },
    docTitle: {
      fontFamily: C.serif,
      fontSize: "36px",
      fontWeight: 700,
      color: C.ink,
      margin: "0 0 4px",
      letterSpacing: "-0.02em",
      lineHeight: 1,
    },
    docSubtitle: {
      fontSize: "12px",
      color: C.inkLight,
      margin: 0,
      fontFamily: C.sans,
      fontStyle: "italic",
    },
    titleRight: {
      textAlign: "right",
      paddingBottom: "4px",
    },
    receiptNoLabel: {
      fontSize: "8px",
      fontWeight: 700,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: C.inkFaint,
      fontFamily: C.sans,
      marginBottom: "4px",
    },
    receiptNoValue: {
      fontFamily: C.mono,
      fontSize: "20px",
      fontWeight: 700,
      color: C.ink,
      letterSpacing: "0.06em",
    },

    // ── STATUS BAR ─────────────────────────────────────────────────────────
    statusBar: {
      display: "grid",
      gridTemplateColumns: "1fr 1px 1fr 1px 1fr 1px 1fr",
      background: C.page,
      borderBottom: `1px solid ${C.border}`,
    },
    statusDivider: {
      background: C.border,
      width: "1px",
    },
    statusCell: {
      padding: "14px 20px",
      display: "flex",
      flexDirection: "column",
      gap: "4px",
    },
    statusLabel: {
      fontSize: "7.5px",
      fontWeight: 700,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: C.inkFaint,
      fontFamily: C.sans,
    },
    statusValue: {
      fontSize: "13px",
      fontWeight: 700,
      color: C.ink,
      fontFamily: C.sans,
    },
    statusValueGreen: {
      fontSize: "13px",
      fontWeight: 700,
      color: C.green,
      fontFamily: C.sans,
      display: "flex",
      alignItems: "center",
      gap: "5px",
    },
    statusValueMono: {
      fontFamily: C.mono,
      fontSize: "9px",
      fontWeight: 400,
      color: C.inkMid,
      lineHeight: 1.5,
      wordBreak: "break-all",
    },
    statusDot: {
      width: "7px",
      height: "7px",
      borderRadius: "50%",
      background: C.greenMid,
      flexShrink: 0,
      display: "inline-block",
    },

    // ── BODY ───────────────────────────────────────────────────────────────
    body: {
      padding: "24px 42px",
    },

    // Section header
    sectionLabel: {
      fontSize: "8.5px",
      fontWeight: 700,
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      color: C.inkLight,
      fontFamily: C.sans,
      margin: "0 0 10px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    sectionLabelLine: {
      flex: 1,
      height: "1px",
      background: C.border,
    },

    // Details table
    detailsTable: {
      width: "100%",
      borderCollapse: "collapse",
      border: `1px solid ${C.border}`,
      marginBottom: "22px",
      fontSize: "12.5px",
    },
    detailsTh: {
      padding: "10px 18px",
      background: C.offWhite,
      borderBottom: `1px solid ${C.border}`,
      borderRight: `1px solid ${C.border}`,
      fontSize: "8.5px",
      fontWeight: 700,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: C.inkMid,
      verticalAlign: "top",
      width: "30%",
      fontFamily: C.sans,
    },
    detailsTd: {
      padding: "10px 18px",
      borderBottom: `1px solid ${C.border}`,
      fontSize: "13px",
      color: C.ink,
      verticalAlign: "top",
      fontFamily: C.sans,
    },
    detailsTdGreen: {
      padding: "10px 18px",
      borderBottom: `1px solid ${C.border}`,
      fontSize: "13px",
      fontWeight: 700,
      color: C.green,
      verticalAlign: "top",
      fontFamily: C.sans,
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },

    // Description box
    descBox: {
      border: `1px solid ${C.border}`,
      borderLeft: `4px solid ${C.green}`,
      padding: "16px 20px",
      marginBottom: "22px",
      background: C.offWhite,
    },
    descText: {
      fontSize: "13px",
      color: C.inkMid,
      lineHeight: 1.85,
      margin: 0,
      fontFamily: C.sans,
    },

    // ── VERIFICATION SECTION ───────────────────────────────────────────────
    verifyGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "16px",
      marginBottom: "22px",
    },
    verifyBox: {
      border: `1px solid ${C.border}`,
      padding: "18px 20px",
    },
    verifyBoxLabel: {
      fontSize: "8px",
      fontWeight: 700,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: C.inkFaint,
      fontFamily: C.sans,
      marginBottom: "8px",
    },
    verifyPlatformName: {
      fontFamily: C.serif,
      fontSize: "16px",
      fontWeight: 700,
      color: C.ink,
      marginBottom: "3px",
    },
    verifyPlatformRole: {
      fontSize: "11px",
      color: C.inkLight,
      fontFamily: C.sans,
    },
    signatureLine: {
      borderTop: `1px solid ${C.borderMid}`,
      marginTop: "20px",
      paddingTop: "8px",
    },

    // Stamp
    stampWrap: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    stamp: {
      width: "108px",
      height: "108px",
      borderRadius: "50%",
      border: `2.5px solid ${C.red}`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "10px",
      transform: "rotate(-14deg)",
    },
    stampTopText: {
      fontSize: "7px",
      fontWeight: 700,
      letterSpacing: "0.15em",
      textTransform: "uppercase",
      color: C.red,
      lineHeight: 1.3,
      fontFamily: C.sans,
    },
    stampMark: {
      fontSize: "28px",
      color: C.red,
      lineHeight: 1.1,
      margin: "2px 0",
    },
    stampBotText: {
      fontSize: "7px",
      fontWeight: 700,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: C.red,
      lineHeight: 1.3,
      fontFamily: C.sans,
    },
    stampDate: {
      fontSize: "6px",
      color: `${C.red}99`,
      fontFamily: C.sans,
      marginTop: "3px",
    },

    // ── DISCLAIMER ─────────────────────────────────────────────────────────
    disclaimer: {
      background: C.amberLight,
      border: `1px solid ${C.amberBorder}`,
      padding: "12px 18px",
      display: "flex",
      alignItems: "flex-start",
      gap: "12px",
      marginBottom: "0",
    },
    disclaimerIcon: {
      fontSize: "14px",
      lineHeight: "1.6",
      flexShrink: 0,
    },
    disclaimerText: {
      fontSize: "10.5px",
      color: C.amber,
      lineHeight: 1.7,
      margin: 0,
      fontFamily: C.sans,
    },

    // ── FOOTER ─────────────────────────────────────────────────────────────
    footerBand: {
      height: "4px",
      background: C.green,
      marginTop: "auto",
    },
    footer: {
      background: C.offWhite,
      borderTop: `1px solid ${C.border}`,
      padding: "12px 42px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    footerText: {
      fontSize: "9px",
      color: C.inkFaint,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      fontFamily: C.sans,
    },
    footerCenter: {
      fontSize: "9px",
      fontWeight: 700,
      color: C.green,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      fontFamily: C.sans,
    },
    footerRight: {
      fontSize: "9px",
      color: C.inkFaint,
      fontFamily: C.mono,
      letterSpacing: "0.06em",
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
        {/* ── TOP SECURITY BAND ── */}
        <div style={S.securityBand} />

        {/* ── HEADER ── */}
        <div style={S.header}>
          <div style={S.headerInner}>
            <div style={S.headerGreenAccent} />
            <div style={S.headerContent}>
              <div style={S.headerLeft}>
                <div style={S.logoBox}>
                  <img
                    src="/Chandabaz_logo.png"
                    alt="ChandaBaz"
                    style={S.logoImg}
                    crossOrigin="anonymous"
                  />
                </div>
                <div style={S.orgBlock}>
                  <div style={S.orgEyebrow}>
                    Corruption Accountability Platform
                  </div>
                  <p style={S.orgName}>ChandaBaz</p>
                  <p style={S.orgTagline}>
                    Protecting Democracy · Fighting Corruption
                  </p>
                </div>
              </div>
              <div style={S.headerRight}>
                <div style={S.headerBadge}>
                  <span style={S.headerBadgeTop}>✦ Issued under ✦</span>
                  <span style={S.headerBadgeMid}>Republic of Bangladesh</span>
                  <span style={S.headerBadgeBot}>
                    Citizen Accountability Initiative
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── TITLE STRIP ── */}
        <div style={S.titleStrip}>
          <div style={S.titleLeft}>
            <div style={S.docType}>Official Satirical Document</div>
            <h1 style={S.docTitle}>Receipt of Dishonesty</h1>
            <p style={S.docSubtitle}>
              A verified acknowledgement of a reported act of corruption
            </p>
          </div>
          <div style={S.titleRight}>
            <div style={S.receiptNoLabel}>Receipt No.</div>
            <div style={S.receiptNoValue}>{receiptNo}</div>
          </div>
        </div>

        {/* ── STATUS BAR ── */}
        <div style={S.statusBar}>
          <div style={S.statusCell}>
            <span style={S.statusLabel}>Case Status</span>
            <span style={S.statusValueGreen}>
              <span style={S.statusDot} />
              Verified
            </span>
          </div>
          <div style={S.statusDivider} />
          <div style={S.statusCell}>
            <span style={S.statusLabel}>Date Issued</span>
            <span style={S.statusValue}>{issuedDate}</span>
          </div>
          <div style={S.statusDivider} />
          <div style={S.statusCell}>
            <span style={S.statusLabel}>Incident Date</span>
            <span style={S.statusValue}>{incidentDate}</span>
          </div>
          <div style={S.statusDivider} />
          <div style={S.statusCell}>
            <span style={S.statusLabel}>Report Ref</span>
            <span style={S.statusValueMono}>{post._id}</span>
          </div>
        </div>

        {/* ── BODY ── */}
        <div style={S.body}>
          {/* Transaction Particulars */}
          <div style={S.sectionLabel}>
            Transaction Particulars
            <div style={S.sectionLabelLine} />
          </div>
          <table style={S.detailsTable}>
            <tbody>
              {tableRows.map(([label, value, isGreen], i) => (
                <tr key={i}>
                  <th style={S.detailsTh}>{label}</th>
                  <td style={isGreen ? S.detailsTdGreen : S.detailsTd}>
                    {isGreen && (
                      <span style={{ color: S.detailsTdGreen.color }}>✓ </span>
                    )}
                    {value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Description */}
          <div style={S.sectionLabel}>
            Description of Incident
            <div style={S.sectionLabelLine} />
          </div>
          <div style={S.descBox}>
            <p style={S.descText}>{desc}</p>
          </div>

          {/* Verification */}
          <div style={S.sectionLabel}>
            Verification &amp; Authorisation
            <div style={S.sectionLabelLine} />
          </div>
          <div style={S.verifyGrid}>
            {/* Authority block */}
            <div style={S.verifyBox}>
              <div style={S.verifyBoxLabel}>Authorised By</div>
              <div style={S.verifyPlatformName}>
                ChandaBaz Verification Engine
              </div>
              <div style={S.verifyPlatformRole}>
                Anti-Corruption Accountability Bureau
              </div>
              <div style={S.signatureLine}>
                <div
                  style={{
                    fontSize: "9px",
                    color: C.inkFaint,
                    fontFamily: C.sans,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Authorised Digital Signatory
                </div>
              </div>
            </div>
            {/* Stamp */}
            <div
              style={{
                ...S.verifyBox,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#FAFAFA",
              }}
            >
              <div style={S.stamp}>
                <span style={S.stampTopText}>Certified{"\n"}By</span>
                <span style={S.stampMark}>✓</span>
                <span style={S.stampBotText}>ChandaBaz</span>
                <span style={S.stampDate}>{issuedDate}</span>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
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
        </div>

        {/* ── FOOTER ── */}
        <div style={S.footerBand} />
        <div style={S.footer}>
          <span style={S.footerText}>chandabaz.com</span>
          <span style={S.footerCenter}>
            Protecting Democracy · Fighting Corruption
          </span>
          <span style={S.footerRight}>Est. 2026</span>
        </div>
      </div>
    </div>
  );
});

export default BribeReceipt;

/**
 * Captures the BribeReceipt element, downloads the PDF locally, then uploads
 * the same PDF to Cloudinary via the backend and returns the stored URL.
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
    backgroundColor: "#FFFFFF",
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

  const pdfDataUri = pdf.output("datauristring");
  pdf.save(`receipt-of-dishonesty-${(post._id || "report").slice(-8)}.pdf`);

  let receiptUrl = post.receiptUrl || null;
  if (post._id && localStorage.getItem("cb_token")) {
    try {
      const { default: api } = await import("../services/api");
      const { data } = await api.post(`/posts/${post._id}/receipt`, {
        receiptData: pdfDataUri,
      });
      receiptUrl = data?.data?.receiptUrl || null;
    } catch {
      // Upload failed — local download already succeeded
    }
  }

  return receiptUrl;
}
