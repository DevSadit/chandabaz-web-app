import { useState, useEffect, useCallback, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { format, formatDistanceToNow } from "date-fns";
import {
  Flame,
  ChevronDown,
  MapPin,
  RefreshCw,
  Filter,
  X,
  AlertCircle,
  Clock,
  Activity,
  TrendingUp,
  Wifi,
  WifiOff,
} from "lucide-react";
import api from "../services/api";

// ─── Bangladesh locations ─────────────────────────────────────────────────
const BD_LOCATIONS = {
  dhaka: [23.8103, 90.4125],
  chittagong: [22.3569, 91.7832],
  sylhet: [24.8949, 91.8687],
  khulna: [22.8456, 89.5403],
  rajshahi: [24.3745, 88.6042],
  barishal: [22.701, 90.3535],
  rangpur: [25.7439, 89.2752],
  mymensingh: [24.7471, 90.4203],
  comilla: [23.4607, 91.1809],
  narayanganj: [23.6238, 90.4996],
  gazipur: [23.9999, 90.4203],
  bogura: [24.8465, 89.372],
  jessore: [23.1664, 89.2182],
  "cox's bazar": [21.4272, 92.0058],
  "cox bazar": [21.4272, 92.0058],
  tangail: [24.2513, 89.9167],
  dinajpur: [25.6217, 88.6354],
  faridpur: [23.607, 89.8429],
  noakhali: [22.8696, 91.0999],
  pabna: [24.0064, 89.2372],
  sirajganj: [24.4534, 89.7006],
  narsingdi: [23.9232, 90.7152],
  manikganj: [23.8624, 90.0095],
  kishoreganj: [24.4447, 90.7766],
  kushtia: [23.9016, 89.1196],
  satkhira: [22.7185, 89.0705],
  bagerhat: [22.6593, 89.7854],
  meherpur: [23.7622, 88.6318],
  jhenaidah: [23.5448, 89.153],
  gopalganj: [23.0056, 89.8274],
  madaripur: [23.1644, 90.2022],
  munshiganj: [23.5461, 90.5345],
  brahmanbaria: [23.9564, 91.1119],
  chandpur: [23.2333, 90.65],
  feni: [23.0225, 91.3944],
  lakshmipur: [22.9463, 90.8412],
  bandarban: [22.1953, 92.2184],
  rangamati: [22.6522, 92.1794],
  khagrachari: [23.1193, 91.9847],
  sunamganj: [25.0662, 91.395],
  moulvibazar: [24.4829, 91.7774],
  habiganj: [24.3745, 91.4152],
  kurigram: [25.8074, 89.636],
  lalmonirhat: [25.9917, 89.2878],
  nilphamari: [25.9311, 88.856],
  gaibandha: [25.3282, 89.5289],
  thakurgaon: [26.0318, 88.4616],
  panchagarh: [26.3408, 88.5551],
  pirojpur: [22.5793, 89.976],
  barguna: [22.15, 90.1122],
  bhola: [22.685, 90.648],
  patuakhali: [22.3596, 90.3296],
  jhalokati: [22.6368, 90.1985],
  jamalpur: [24.898, 89.9468],
  sherpur: [25.0227, 90.0148],
  netrokona: [24.8697, 90.7279],
  natore: [24.4172, 89.0009],
  joypurhat: [25.0965, 89.0201],
  chapainawabganj: [24.5977, 88.276],
  naogaon: [24.7936, 88.9312],
  narail: [23.1724, 89.5124],
  magura: [23.4887, 89.4199],
  chuadanga: [23.6401, 88.8419],
  shariatpur: [23.2422, 90.4349],
  mirpur: [23.8223, 90.3654],
  mohammadpur: [23.7627, 90.3594],
  uttara: [23.8759, 90.3795],
  gulshan: [23.7925, 90.4078],
  dhanmondi: [23.7461, 90.3742],
  motijheel: [23.7338, 90.4176],
};

const CATEGORIES = [
  { value: "", label: "All Categories", color: "#ef4444" },
  { value: "police", label: "Police", color: "#f97316" },
  { value: "government", label: "Government", color: "#eab308" },
  { value: "healthcare", label: "Healthcare", color: "#22c55e" },
  { value: "education", label: "Education", color: "#3b82f6" },
  { value: "judiciary", label: "Judiciary", color: "#8b5cf6" },
  { value: "land", label: "Land / Revenue", color: "#06b6d4" },
  { value: "bribery", label: "Bribery", color: "#ec4899" },
  { value: "customs", label: "Customs / Tax", color: "#f59e0b" },
];

const DEMO_DATA = [
  { location: "dhaka", count: 42, tags: ["police", "government", "bribery"] },
  { location: "chittagong", count: 28, tags: ["customs", "land", "police"] },
  { location: "narayanganj", count: 17, tags: ["land", "customs"] },
  { location: "khulna", count: 19, tags: ["land", "judiciary"] },
  {
    location: "cox's bazar",
    count: 13,
    tags: ["land", "bribery", "government"],
  },
  { location: "sylhet", count: 15, tags: ["government", "education"] },
  { location: "rangpur", count: 14, tags: ["police", "government"] },
  { location: "rajshahi", count: 12, tags: ["education", "healthcare"] },
  { location: "mymensingh", count: 11, tags: ["healthcare", "education"] },
  { location: "barishal", count: 10, tags: ["government", "land"] },
  { location: "gazipur", count: 9, tags: ["government", "bribery"] },
  { location: "comilla", count: 8, tags: ["police", "bribery"] },
  { location: "dinajpur", count: 8, tags: ["government", "land"] },
  { location: "bogura", count: 7, tags: ["police", "land"] },
  { location: "noakhali", count: 7, tags: ["police", "bribery"] },
  { location: "jessore", count: 6, tags: ["customs", "government"] },
  { location: "faridpur", count: 6, tags: ["judiciary", "land"] },
  { location: "sirajganj", count: 6, tags: ["land", "government"] },
  { location: "brahmanbaria", count: 5, tags: ["government", "land"] },
  { location: "narsingdi", count: 5, tags: ["government", "bribery"] },
  { location: "kushtia", count: 5, tags: ["government", "healthcare"] },
  { location: "tangail", count: 5, tags: ["police", "education"] },
  { location: "sunamganj", count: 4, tags: ["government", "education"] },
  { location: "habiganj", count: 4, tags: ["land", "police"] },
  { location: "feni", count: 4, tags: ["police", "bribery"] },
  { location: "pabna", count: 4, tags: ["land", "customs"] },
  { location: "chandpur", count: 3, tags: ["judiciary", "bribery"] },
  { location: "moulvibazar", count: 3, tags: ["education", "government"] },
];

const AUTO_REFRESH_SEC = 60;

function resolveCoords(locationStr) {
  const lower = (locationStr || "").toLowerCase().trim();
  if (BD_LOCATIONS[lower]) return BD_LOCATIONS[lower];
  for (const [key, coords] of Object.entries(BD_LOCATIONS)) {
    if (lower.includes(key) || key.includes(lower)) return coords;
  }
  return null;
}

function heatColor(intensity) {
  if (intensity >= 0.85) return "#7f1d1d";
  if (intensity >= 0.68) return "#ef4444";
  if (intensity >= 0.5) return "#f97316";
  if (intensity >= 0.33) return "#fbbf24";
  if (intensity >= 0.16) return "#fde68a";
  return "#d1fae5";
}

function MapResizer() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 100);
  }, [map]);
  return null;
}

/* ── Inline CSS ─────────────────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');

  .hm-root * { box-sizing: border-box; }
  .hm-root { font-family: 'DM Sans', sans-serif; background: #0A0F0D; min-height: 100vh; }

  /* ── Noise + grid shared ── */
  .hm-noise {
    position: absolute; inset: 0; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
    opacity: 0.025;
  }
  .hm-grid {
    position: absolute; inset: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(1,145,69,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(1,145,69,0.04) 1px, transparent 1px);
    background-size: 64px 64px;
  }

  /* ── Page header ── */
  .hm-header {
    position: relative; overflow: hidden;
    border-bottom: 1px solid rgba(1,145,69,0.10);
  }
  .hm-header::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(1,145,69,0.5), transparent);
  }
  .hm-header-glow {
    position: absolute; top: -30%; left: -5%; width: 600px; height: 500px;
    background: radial-gradient(ellipse, rgba(1,145,69,0.18) 0%, transparent 65%);
    filter: blur(80px); pointer-events: none;
  }
  .hm-inner { max-width: 1280px; margin: 0 auto; padding: 0 32px; }
  @media (max-width: 640px) { .hm-inner { padding: 0 20px; } }

  /* ── Section label ── */
  .hm-eyebrow {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 10px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase;
    color: #019145; margin-bottom: 12px;
  }
  .hm-eyebrow::before, .hm-eyebrow::after {
    content: ''; display: block; width: 16px; height: 1px; background: #019145; opacity: 0.4;
  }

  /* ── Stat chips ── */
  .hm-stat-chip {
    padding: 14px 18px; border-radius: 2px; min-width: 100px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(1,145,69,0.12);
  }
  .hm-stat-label {
    font-size: 9px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
    color: rgba(255,255,255,0.28); margin: 0 0 5px;
  }
  .hm-stat-value {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 22px; font-weight: 800; color: #fff; line-height: 1; margin: 0;
  }

  /* ── Live / Demo badge ── */
  .hm-live-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 10px; border-radius: 2px;
    font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
  }
  .hm-live-dot { width: 6px; height: 6px; border-radius: 50%; animation: hm-pulse 2s infinite; }
  @keyframes hm-pulse {
    0%,100% { opacity:1; transform:scale(1); }
    50% { opacity:0.5; transform:scale(0.8); }
  }

  /* ── Controls bar ── */
  .hm-controls {
    padding: 16px 0;
    border-bottom: 1px solid rgba(1,145,69,0.08);
    position: relative; z-index: 9999;   /* KEY FIX: above Leaflet */
  }
  .hm-controls-inner {
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 12px;
  }

  /* Category dropdown trigger */
  .hm-dd-trigger {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 9px 14px; border-radius: 2px; cursor: pointer;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(1,145,69,0.18);
    color: rgba(255,255,255,0.80);
    font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600;
    letter-spacing: 0.06em; text-transform: uppercase;
    transition: border-color 0.2s, background 0.2s;
  }
  .hm-dd-trigger:hover { border-color: rgba(1,145,69,0.40); background: rgba(1,145,69,0.06); }

  /* ── DROPDOWN ── The critical fix: position:fixed so it escapes all stacking contexts */
  .hm-dd-menu {
    position: fixed;          /* escape Leaflet stacking context */
    z-index: 99999;           /* above everything */
    width: 220px;
    background: #0E1812;
    border: 1px solid rgba(1,145,69,0.20);
    border-radius: 2px;
    box-shadow: 0 24px 64px rgba(0,0,0,0.70), 0 0 0 1px rgba(1,145,69,0.08);
    overflow: hidden;
    padding: 4px;
  }
  .hm-dd-item {
    display: flex; align-items: center; gap: 10px;
    width: 100%; padding: 9px 12px; border-radius: 1px;
    background: transparent; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500;
    color: rgba(255,255,255,0.55); text-align: left;
    transition: background 0.15s, color 0.15s;
  }
  .hm-dd-item:hover { background: rgba(1,145,69,0.10); color: rgba(255,255,255,0.90); }
  .hm-dd-item.active { background: rgba(1,145,69,0.14); color: #fff; }
  .hm-dd-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .hm-dd-count {
    margin-left: auto; font-size: 10px; font-family: monospace;
    color: rgba(255,255,255,0.25);
  }
  .hm-dd-check { margin-left: 4px; color: #019145; font-size: 12px; }

  /* Refresh btn */
  .hm-btn-refresh {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 9px 16px; border-radius: 2px; cursor: pointer;
    background: rgba(1,145,69,0.08);
    border: 1px solid rgba(1,145,69,0.22);
    color: #019145;
    font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600;
    letter-spacing: 0.06em; text-transform: uppercase;
    transition: background 0.2s, border-color 0.2s;
  }
  .hm-btn-refresh:hover { background: rgba(1,145,69,0.15); border-color: rgba(1,145,69,0.40); }
  .hm-btn-refresh:disabled { opacity: 0.4; cursor: not-allowed; }

  /* Clear btn */
  .hm-btn-clear {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 9px 14px; border-radius: 2px; cursor: pointer;
    background: transparent; border: 1px solid rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.40);
    font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600;
    letter-spacing: 0.06em; text-transform: uppercase;
    transition: border-color 0.2s, color 0.2s;
  }
  .hm-btn-clear:hover { border-color: rgba(255,255,255,0.20); color: rgba(255,255,255,0.70); }

  /* Countdown row */
  .hm-countdown-row { display: flex; align-items: center; gap: 12px; }
  .hm-updated {
    display: flex; align-items: center; gap: 5px;
    font-size: 11px; color: rgba(255,255,255,0.25);
  }

  /* ── Map container ── */
  .hm-map-wrap {
    position: relative; border-radius: 2px; overflow: hidden;
    border: 1px solid rgba(1,145,69,0.12);
    box-shadow: 0 20px 60px rgba(0,0,0,0.50);
  }

  /* Loading overlay */
  .hm-loading-overlay {
    position: absolute; inset: 0; z-index: 20;
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px;
    background: rgba(10,15,13,0.82); backdrop-filter: blur(8px);
  }
  .hm-spinner {
    width: 36px; height: 36px; border-radius: 50%;
    border: 2px solid rgba(1,145,69,0.20);
    border-top-color: #019145;
    animation: hm-spin 0.8s linear infinite;
  }
  @keyframes hm-spin { to { transform: rotate(360deg); } }

  /* Map badge (top-left) */
  .hm-map-badge {
    position: absolute; top: 14px; left: 14px; z-index: 1000;
    display: flex; align-items: center; gap: 7px;
    padding: 7px 12px; border-radius: 2px;
    background: rgba(10,15,13,0.82); backdrop-filter: blur(16px);
    border: 1px solid rgba(1,145,69,0.15);
    font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.60);
  }

  /* Legend (bottom-right) */
  .hm-legend {
    position: absolute; bottom: 14px; right: 14px; z-index: 1000;
    padding: 18px 20px; border-radius: 2px;
    background: rgba(10,15,13,0.82); backdrop-filter: blur(16px);
    border: 1px solid rgba(1,145,69,0.12);
    box-shadow: 0 8px 32px rgba(0,0,0,0.50);
    min-width: 180px;
  }
  .hm-legend-title {
    display: flex; align-items: center; gap: 6px;
    font-size: 9px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase;
    color: rgba(255,255,255,0.40); margin-bottom: 14px;
    padding-bottom: 10px; border-bottom: 1px solid rgba(1,145,69,0.10);
  }
  .hm-legend-item {
    display: flex; align-items: center; gap: 9px;
    margin-bottom: 8px;
  }
  .hm-legend-swatch { width: 10px; height: 10px; border-radius: 1px; flex-shrink: 0; }
  .hm-legend-label { font-size: 11px; color: rgba(255,255,255,0.45); flex: 1; }
  .hm-legend-range { font-size: 10px; font-family: monospace; color: rgba(255,255,255,0.20); }
  .hm-legend-bar {
    height: 4px; border-radius: 2px; width: 100%; margin: 10px 0 4px;
    background: linear-gradient(to right, #d1fae5, #fde68a, #f97316, #ef4444, #7f1d1d);
  }
  .hm-legend-bar-labels {
    display: flex; justify-content: space-between;
    font-size: 9px; color: rgba(255,255,255,0.20);
    margin-bottom: 10px;
  }
  .hm-legend-footer {
    padding-top: 10px; border-top: 1px solid rgba(1,145,69,0.08);
    font-size: 10px; color: rgba(255,255,255,0.20); text-align: center;
  }

  /* ── Bottom section ── */
  .hm-section-label {
    display: flex; align-items: center; gap: 8px;
    font-size: 9px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase;
    color: rgba(255,255,255,0.30); margin-bottom: 16px;
    padding-bottom: 10px; border-bottom: 1px solid rgba(1,145,69,0.08);
  }

  /* Ranking cards */
  .hm-rank-card {
    padding: 16px; border-radius: 2px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(1,145,69,0.08);
    transition: border-color 0.2s, background 0.2s, transform 0.2s;
  }
  .hm-rank-card:hover {
    border-color: rgba(1,145,69,0.20); background: rgba(1,145,69,0.04);
    transform: translateY(-2px);
  }
  .hm-rank-num {
    font-size: 9px; font-weight: 700; letter-spacing: 0.10em;
    color: rgba(255,255,255,0.20); margin-bottom: 8px;
  }
  .hm-rank-name {
    font-size: 13px; font-weight: 600; color: #fff;
    text-transform: capitalize; margin-bottom: 10px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .hm-rank-count {
    font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 2px;
    float: right; margin-top: -28px; margin-bottom: 4px;
  }
  .hm-rank-bar-track {
    height: 2px; border-radius: 1px; background: rgba(255,255,255,0.07); clear: both;
  }
  .hm-rank-bar-fill { height: 100%; border-radius: 1px; transition: width 0.7s ease; }

  /* Category breakdown */
  .hm-cat-panel {
    border-radius: 2px; overflow: hidden;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(1,145,69,0.10);
  }
  .hm-cat-btn {
    display: flex; align-items: center; gap: 10px;
    width: 100%; padding: 12px 16px;
    background: transparent; border: none; cursor: pointer;
    text-align: left; border-bottom: 1px solid rgba(1,145,69,0.06);
    transition: background 0.15s;
  }
  .hm-cat-btn:last-child { border-bottom: none; }
  .hm-cat-btn:hover { background: rgba(1,145,69,0.06); }
  .hm-cat-btn.active { background: rgba(1,145,69,0.08); }
  .hm-cat-name { font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.65); flex: 1; }
  .hm-cat-count { font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.35); margin-left: 8px; }
  .hm-cat-bar-track { height: 2px; border-radius: 1px; background: rgba(255,255,255,0.06); margin-top: 5px; }
  .hm-cat-bar-fill { height: 100%; border-radius: 1px; transition: width 0.5s ease; }
  .hm-cat-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

  /* No data */
  .hm-empty {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 64px 24px; text-align: center;
    border: 1px solid rgba(1,145,69,0.08); border-radius: 2px;
    background: rgba(255,255,255,0.01);
  }

  /* Leaflet popup override */
  .leaflet-popup-content-wrapper {
    border-radius: 2px !important;
    border: 1px solid rgba(1,145,69,0.15) !important;
    box-shadow: 0 12px 40px rgba(0,0,0,0.25) !important;
    font-family: 'DM Sans', sans-serif !important;
  }
  .leaflet-popup-tip { display: none !important; }
`;

export default function Heatmap() {
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDemo, setIsDemo] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [heatPoints, setHeatPoints] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    locations: 0,
    topCity: "—",
    hottest: 0,
  });
  const [lastUpdated, setLastUpdated] = useState(null);
  const [countdown, setCountdown] = useState(AUTO_REFRESH_SEC);
  const countdownRef = useRef(null);
  const ddBtnRef = useRef(null); // for positioning the fixed dropdown
  const [ddPos, setDdPos] = useState({ top: 0, left: 0 });

  /* open dropdown — compute position from trigger button */
  const openDropdown = () => {
    if (ddBtnRef.current) {
      const r = ddBtnRef.current.getBoundingClientRect();
      setDdPos({ top: r.bottom + 6, left: r.left });
    }
    setDropdownOpen(true);
  };

  const fetchAllPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const first = await api.get("/posts?page=1&limit=100");
      const { data: firstBatch, pagination } = first.data;
      let posts = [...(firstBatch || [])];
      if (pagination && pagination.pages > 1) {
        const pageNums = Array.from(
          { length: pagination.pages - 1 },
          (_, i) => i + 2,
        );
        const rest = await Promise.all(
          pageNums.map((p) =>
            api
              .get(`/posts?page=${p}&limit=100`)
              .then((r) => r.data.data || []),
          ),
        );
        posts = [...posts, ...rest.flat()];
      }
      setAllPosts(posts);
      setIsDemo(posts.length === 0);
      setLastUpdated(new Date());
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load posts. Using demo data.",
      );
      setAllPosts([]);
      setIsDemo(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllPosts();
  }, [fetchAllPosts]);

  useEffect(() => {
    setCountdown(AUTO_REFRESH_SEC);
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          fetchAllPosts();
          return AUTO_REFRESH_SEC;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(countdownRef.current);
  }, [fetchAllPosts, lastUpdated]);

  useEffect(() => {
    const source = isDemo ? DEMO_DATA : null;
    const locMap = {};
    if (source) {
      for (const { location, count, tags } of source) {
        if (selectedCategory && !tags.includes(selectedCategory)) continue;
        const coords = resolveCoords(location);
        if (!coords) continue;
        const key = coords.join(",");
        if (!locMap[key])
          locMap[key] = { coords, count: 0, name: location, posts: [] };
        locMap[key].count += count;
      }
    } else {
      for (const post of allPosts) {
        if (selectedCategory) {
          const postTags = (post.tags || []).map((t) => t.toLowerCase());
          if (!postTags.some((t) => t.includes(selectedCategory))) continue;
        }
        const coords = resolveCoords(post.location);
        if (!coords) continue;
        const key = coords.join(",");
        if (!locMap[key])
          locMap[key] = { coords, count: 0, name: post.location, posts: [] };
        locMap[key].count += 1;
        if (locMap[key].posts.length < 3)
          locMap[key].posts.push({
            id: post._id,
            title: post.title,
            tags: post.tags || [],
            date: post.incidentDate || post.createdAt,
          });
      }
    }
    const points = Object.values(locMap);
    const maxCount = points.reduce((m, p) => Math.max(m, p.count), 1);
    const withIntensity = points.map((p) => ({
      ...p,
      intensity: Math.min(p.count / maxCount, 1),
    }));
    setHeatPoints(withIntensity);
    const sorted = [...withIntensity].sort((a, b) => b.count - a.count);
    setStats({
      total: withIntensity.reduce((s, p) => s + p.count, 0),
      locations: withIntensity.length,
      topCity: sorted[0]?.name || "—",
      hottest: sorted[0]?.count || 0,
    });
  }, [allPosts, selectedCategory, isDemo]);

  const selectedCat =
    CATEGORIES.find((c) => c.value === selectedCategory) ?? CATEGORIES[0];
  const sortedPoints = [...heatPoints].sort((a, b) => b.count - a.count);
  const globalMax = sortedPoints[0]?.count || 1;

  const categoryBreakdown = CATEGORIES.slice(1)
    .map((cat) => {
      const count = isDemo
        ? DEMO_DATA.filter((d) => d.tags.includes(cat.value)).length
        : allPosts.filter((p) =>
            (p.tags || []).some((t) => t.toLowerCase().includes(cat.value)),
          ).length;
      return { ...cat, count };
    })
    .sort((a, b) => b.count - a.count);

  return (
    <div className="hm-root">
      <style>{css}</style>

      {/* ══ HEADER ══ */}
      <div className="hm-header">
        <div className="hm-noise" />
        <div className="hm-grid" />
        <div className="hm-header-glow" />
        <div
          className="hm-inner"
          style={{
            position: "relative",
            zIndex: 2,
            paddingTop: 40,
            paddingBottom: 32,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 24,
            }}
          >
            {/* Left */}
            <div>
              <div className="hm-eyebrow">
                <Flame size={12} /> Corruption Intelligence
              </div>
              <h1
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(2rem,4vw,3rem)",
                  fontWeight: 900,
                  color: "#fff",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.05,
                  margin: "0 0 12px",
                }}
              >
                Corruption <span style={{ color: "#019145" }}>Heatmap</span>
              </h1>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <p
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.38)",
                    margin: 0,
                    lineHeight: 1.7,
                    maxWidth: 440,
                  }}
                >
                  {isDemo
                    ? "Showing demo data — no approved reports yet."
                    : `Visualising ${allPosts.length.toLocaleString()} approved reports across Bangladesh.`}
                </p>
                {!loading && (
                  <span
                    className="hm-live-badge"
                    style={
                      isDemo
                        ? {
                            background: "rgba(251,191,36,0.10)",
                            color: "#fbbf24",
                            border: "1px solid rgba(251,191,36,0.20)",
                          }
                        : {
                            background: "rgba(1,145,69,0.10)",
                            color: "#019145",
                            border: "1px solid rgba(1,145,69,0.22)",
                          }
                    }
                  >
                    {isDemo ? (
                      <WifiOff size={9} />
                    ) : (
                      <span
                        className="hm-live-dot"
                        style={{
                          background: "#019145",
                          boxShadow: "0 0 6px #019145",
                        }}
                      />
                    )}
                    {isDemo ? "Demo" : "Live"}
                  </span>
                )}
              </div>
            </div>

            {/* Stats row */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {[
                {
                  label: "Total Incidents",
                  value: stats.total.toLocaleString(),
                },
                { label: "Active Zones", value: stats.locations },
                { label: "Top Hotspot", value: stats.topCity, cap: true },
                { label: "Peak Reports", value: stats.hottest },
              ].map(({ label, value, cap }) => (
                <div key={label} className="hm-stat-chip">
                  <p className="hm-stat-label">{label}</p>
                  <p
                    className="hm-stat-value"
                    style={{ textTransform: cap ? "capitalize" : "none" }}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══ CONTROLS ══ */}
      <div
        className="hm-controls"
        style={{ position: "relative", zIndex: 9999 }}
      >
        <div className="hm-inner">
          <div className="hm-controls-inner">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              {/* Dropdown trigger */}
              <div style={{ position: "relative" }}>
                <button
                  ref={ddBtnRef}
                  className="hm-dd-trigger"
                  onClick={() =>
                    dropdownOpen ? setDropdownOpen(false) : openDropdown()
                  }
                >
                  <Filter
                    size={12}
                    style={{ color: "rgba(255,255,255,0.35)" }}
                  />
                  <span
                    className="hm-dd-dot"
                    style={{ background: selectedCat.color }}
                  />
                  {selectedCat.label}
                  <ChevronDown
                    size={12}
                    style={{
                      color: "rgba(255,255,255,0.35)",
                      transform: dropdownOpen ? "rotate(180deg)" : "none",
                      transition: "transform 0.2s",
                    }}
                  />
                </button>
              </div>

              {/* Refresh */}
              <button
                className="hm-btn-refresh"
                onClick={() => {
                  fetchAllPosts();
                  setCountdown(AUTO_REFRESH_SEC);
                }}
                disabled={loading}
              >
                <RefreshCw
                  size={12}
                  style={{
                    animation: loading
                      ? "hm-spin 0.8s linear infinite"
                      : "none",
                  }}
                />
                Refresh
              </button>

              {/* Clear */}
              {selectedCategory && (
                <button
                  className="hm-btn-clear"
                  onClick={() => setSelectedCategory("")}
                >
                  <X size={11} /> Clear Filter
                </button>
              )}
            </div>

            {/* Right — countdown */}
            {lastUpdated && (
              <div className="hm-countdown-row">
                <span className="hm-updated">
                  <Clock size={11} />
                  Updated{" "}
                  {formatDistanceToNow(lastUpdated, { addSuffix: true })}
                </span>
                <div
                  style={{
                    position: "relative",
                    width: 32,
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      transform: "rotate(-90deg)",
                    }}
                    viewBox="0 0 32 32"
                  >
                    <circle
                      cx="16"
                      cy="16"
                      r="13"
                      fill="none"
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="2.5"
                    />
                    <circle
                      cx="16"
                      cy="16"
                      r="13"
                      fill="none"
                      stroke="#019145"
                      strokeWidth="2.5"
                      strokeDasharray={`${2 * Math.PI * 13}`}
                      strokeDashoffset={`${2 * Math.PI * 13 * (1 - countdown / AUTO_REFRESH_SEC)}`}
                      strokeLinecap="round"
                      style={{ transition: "stroke-dashoffset 1s linear" }}
                    />
                  </svg>
                  <span
                    style={{ fontSize: 9, fontWeight: 700, color: "#019145" }}
                  >
                    {countdown}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══ FIXED DROPDOWN (outside map stacking context) ══ */}
      {dropdownOpen && (
        <>
          <div
            style={{ position: "fixed", inset: 0, zIndex: 99998 }}
            onClick={() => setDropdownOpen(false)}
          />
          <div
            className="hm-dd-menu"
            style={{ top: ddPos.top, left: ddPos.left }}
          >
            {CATEGORIES.map((cat) => {
              const count = isDemo
                ? cat.value
                  ? DEMO_DATA.filter((d) => d.tags.includes(cat.value)).reduce(
                      (s, d) => s + d.count,
                      0,
                    )
                  : DEMO_DATA.reduce((s, d) => s + d.count, 0)
                : cat.value
                  ? allPosts.filter((p) =>
                      (p.tags || []).some((t) =>
                        t.toLowerCase().includes(cat.value),
                      ),
                    ).length
                  : allPosts.length;
              return (
                <button
                  key={cat.value}
                  className={`hm-dd-item${selectedCategory === cat.value ? " active" : ""}`}
                  onClick={() => {
                    setSelectedCategory(cat.value);
                    setDropdownOpen(false);
                  }}
                >
                  <span
                    className="hm-dd-dot"
                    style={{ background: cat.color }}
                  />
                  <span style={{ flex: 1 }}>{cat.label}</span>
                  <span className="hm-dd-count">{count}</span>
                  {selectedCategory === cat.value && (
                    <span className="hm-dd-check">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* ══ MAP ══ */}
      <div className="hm-inner" style={{ paddingTop: 20, paddingBottom: 20 }}>
        <div className="hm-map-wrap" style={{ height: 580 }}>
          {/* Loading */}
          {loading && (
            <div className="hm-loading-overlay">
              <div className="hm-spinner" />
              <p
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.35)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Fetching reports…
              </p>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="hm-loading-overlay">
              <AlertCircle size={32} color="#ef4444" />
              <p
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.45)",
                  maxWidth: 280,
                  textAlign: "center",
                }}
              >
                {error}
              </p>
              <button className="hm-btn-refresh" onClick={fetchAllPosts}>
                Retry
              </button>
            </div>
          )}

          <MapContainer
            center={[23.685, 90.3563]}
            zoom={7}
            style={{ width: "100%", height: "100%" }}
            zoomControl={false}
            scrollWheelZoom
            attributionControl={false}
          >
            <MapResizer />
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              subdomains="abcd"
              maxZoom={20}
            />

            {/* Glow rings */}
            {heatPoints.map((pt, i) => (
              <CircleMarker
                key={`glow-${i}`}
                center={pt.coords}
                radius={Math.max(24, pt.intensity * 72)}
                pathOptions={{
                  fillColor: heatColor(pt.intensity),
                  fillOpacity: 0.14 + pt.intensity * 0.22,
                  color: "transparent",
                  weight: 0,
                }}
                interactive={false}
              />
            ))}

            {/* Cores */}
            {heatPoints.map((pt, i) => (
              <CircleMarker
                key={`core-${i}`}
                center={pt.coords}
                radius={Math.max(6, pt.intensity * 28)}
                pathOptions={{
                  fillColor: heatColor(pt.intensity),
                  fillOpacity: 0.55 + pt.intensity * 0.32,
                  color: "transparent",
                  weight: 0,
                }}
              >
                <Popup maxWidth={220}>
                  <div
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      minWidth: 180,
                      padding: "2px 0",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 10,
                        paddingBottom: 10,
                        borderBottom: "1px solid rgba(1,145,69,0.12)",
                      }}
                    >
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: heatColor(pt.intensity),
                          flexShrink: 0,
                          display: "inline-block",
                        }}
                      />
                      <p
                        style={{
                          fontWeight: 700,
                          fontSize: 13,
                          color: "#0A0F0D",
                          textTransform: "capitalize",
                          margin: 0,
                        }}
                      >
                        {pt.name}
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 8,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          color: "#6B7B73",
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                        }}
                      >
                        Incidents
                      </span>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          padding: "2px 10px",
                          borderRadius: 2,
                          background: `${heatColor(pt.intensity)}18`,
                          color: heatColor(pt.intensity),
                        }}
                      >
                        {pt.count}
                      </span>
                    </div>
                    {selectedCategory && (
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 8px",
                          borderRadius: 2,
                          fontSize: 10,
                          fontWeight: 700,
                          color: "#fff",
                          background: selectedCat.color,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          marginBottom: 8,
                        }}
                      >
                        {selectedCat.label}
                      </span>
                    )}
                    {!isDemo && pt.posts?.length > 0 && (
                      <div
                        style={{
                          marginTop: 8,
                          paddingTop: 8,
                          borderTop: "1px solid rgba(1,145,69,0.10)",
                        }}
                      >
                        <p
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            color: "#9AA8A0",
                            margin: "0 0 6px",
                          }}
                        >
                          Recent Reports
                        </p>
                        {pt.posts.map((p, j) => (
                          <p
                            key={j}
                            style={{
                              fontSize: 11,
                              color: "#3A4A42",
                              margin: "0 0 4px",
                              lineHeight: 1.5,
                              overflow: "hidden",
                              display: "-webkit-box",
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            · {p.title}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>

          {/* Map badge top-left */}
          <div className="hm-map-badge">
            {selectedCategory ? (
              <>
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: selectedCat.color,
                  }}
                />
                {selectedCat.label}
                <button
                  onClick={() => setSelectedCategory("")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "rgba(255,255,255,0.35)",
                    cursor: "pointer",
                    padding: 0,
                    display: "flex",
                  }}
                >
                  <X size={11} />
                </button>
              </>
            ) : (
              <>
                {isDemo ? (
                  <WifiOff size={11} color="#fbbf24" />
                ) : (
                  <Wifi size={11} color="#019145" />
                )}
                {isDemo ? "Demo data" : `${allPosts.length} live reports`}
              </>
            )}
          </div>

          {/* Legend */}
          <div className="hm-legend">
            <div className="hm-legend-title">
              <Flame size={11} color="#019145" /> Intensity Scale
            </div>
            {[
              { label: "Critical", color: "#7f1d1d", range: "40+" },
              { label: "High", color: "#ef4444", range: "25–39" },
              { label: "Elevated", color: "#f97316", range: "15–24" },
              { label: "Moderate", color: "#fbbf24", range: "8–14" },
              { label: "Low", color: "#fde68a", range: "1–7" },
            ].map(({ label, color, range }) => (
              <div key={label} className="hm-legend-item">
                <span
                  className="hm-legend-swatch"
                  style={{ background: color }}
                />
                <span className="hm-legend-label">{label}</span>
                <span className="hm-legend-range">{range}</span>
              </div>
            ))}
            <div className="hm-legend-bar" />
            <div className="hm-legend-bar-labels">
              <span>Low</span>
              <span>Critical</span>
            </div>
            <div className="hm-legend-footer">
              {heatPoints.length} zones mapped
            </div>
          </div>
        </div>
      </div>

      {/* ══ BOTTOM: Rankings + Categories ══ */}
      <div className="hm-inner" style={{ paddingBottom: 64 }}>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}
        >
          {/* Rankings */}
          <div>
            <div className="hm-section-label">
              <TrendingUp size={12} color="#019145" />
              Hotspot Rankings
              {selectedCategory && (
                <span
                  style={{
                    padding: "2px 8px",
                    borderRadius: 2,
                    fontSize: 9,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.10em",
                    background: `${selectedCat.color}20`,
                    color: selectedCat.color,
                  }}
                >
                  {selectedCat.label}
                </span>
              )}
            </div>
            {sortedPoints.length === 0 ? (
              <div className="hm-empty">
                <MapPin
                  size={28}
                  color="rgba(255,255,255,0.15)"
                  style={{ marginBottom: 12 }}
                />
                <p
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.25)",
                    margin: 0,
                  }}
                >
                  No reports match this filter.
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 10,
                }}
              >
                {sortedPoints.slice(0, 8).map((pt, i) => {
                  const pct = (pt.count / globalMax) * 100;
                  const color = heatColor(pt.intensity);
                  return (
                    <div key={i} className="hm-rank-card">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          marginBottom: 8,
                        }}
                      >
                        <span className="hm-rank-num">#{i + 1}</span>
                        <span
                          className="hm-rank-count"
                          style={{ background: `${color}18`, color }}
                        >
                          {pt.count}
                        </span>
                      </div>
                      <p className="hm-rank-name">{pt.name}</p>
                      <div className="hm-rank-bar-track">
                        <div
                          className="hm-rank-bar-fill"
                          style={{ width: `${pct}%`, background: color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Categories */}
          <div>
            <div className="hm-section-label">
              <Activity size={12} color="#019145" /> By Category
            </div>
            <div className="hm-cat-panel">
              {categoryBreakdown.map((cat) => {
                const maxCat = categoryBreakdown[0]?.count || 1;
                const pct = maxCat > 0 ? (cat.count / maxCat) * 100 : 0;
                return (
                  <button
                    key={cat.value}
                    className={`hm-cat-btn${selectedCategory === cat.value ? " active" : ""}`}
                    onClick={() =>
                      setSelectedCategory(
                        selectedCategory === cat.value ? "" : cat.value,
                      )
                    }
                  >
                    <span
                      className="hm-cat-dot"
                      style={{ background: cat.color }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span className="hm-cat-name">{cat.label}</span>
                        <span className="hm-cat-count">{cat.count}</span>
                      </div>
                      <div className="hm-cat-bar-track">
                        <div
                          className="hm-cat-bar-fill"
                          style={{ width: `${pct}%`, background: cat.color }}
                        />
                      </div>
                    </div>
                    {selectedCategory === cat.value && (
                      <span
                        style={{
                          fontSize: 12,
                          color: "#019145",
                          marginLeft: 6,
                        }}
                      >
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {lastUpdated && (
              <p
                style={{
                  fontSize: 10,
                  color: "rgba(255,255,255,0.18)",
                  textAlign: "center",
                  marginTop: 12,
                }}
              >
                Synced: {format(lastUpdated, "HH:mm:ss, dd MMM yyyy")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
