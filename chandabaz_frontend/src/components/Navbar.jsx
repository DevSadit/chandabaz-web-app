import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Menu,
  X,
  LogOut,
  User,
  Plus,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";

const navCss = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');

  .nb-root * { box-sizing: border-box; }
  .nb-root { font-family: 'DM Sans', sans-serif; }

  /* ── Header shell ── */
  .nb-header {
    position: sticky; top: 0; z-index: 50;
    border-bottom: 1px solid rgba(1,145,69,0.10);
    transition: background 0.3s, box-shadow 0.3s, border-color 0.3s;
  }
  .nb-header.scrolled {
    background: rgba(255,255,255,0.96);
    backdrop-filter: blur(16px);
    box-shadow: 0 4px 32px rgba(0,0,0,0.05);
    border-color: rgba(1,145,69,0.14);
  }
  .nb-header.top {
    background: rgba(255,255,255,0.88);
    backdrop-filter: blur(10px);
  }

  /* ── Inner ── */
  .nb-inner {
    max-width: 1280px; margin: 0 auto; padding: 0 32px;
    display: flex; align-items: center; justify-content: space-between;
    height: 64px;
  }
  @media (max-width: 640px) { .nb-inner { padding: 0 20px; } }

  /* ── Logo ── */
  .nb-logo {
    display: inline-flex; align-items: center; gap: 10px;
    text-decoration: none; flex-shrink: 0;
  }
  .nb-logo-mark {
    width: 32px; height: 32px;
    background: #019145;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    border-radius: 2px;
  }
  .nb-logo-img {
    width: 28px; height: 28px; object-fit: contain;
  }
  .nb-logo-wordmark {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 18px; font-weight: 800;
    color: #0A0F0D; letter-spacing: -0.02em;
    line-height: 1;
  }
  .nb-logo-wordmark span { color: #019145; }
  .nb-logo:hover .nb-logo-wordmark { color: #019145; }
  .nb-logo:hover .nb-logo-mark { background: #016934; }
  .nb-logo-mark, .nb-logo-wordmark { transition: all 0.2s; }

  /* ── Desktop nav links ── */
  .nb-nav { display: flex; align-items: center; gap: 2px; }
  @media (max-width: 767px) { .nb-nav { display: none; } }

  .nb-navlink {
    font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
    color: #6B7B73; text-decoration: none;
    padding: 6px 14px; border-radius: 2px;
    border-bottom: 2px solid transparent;
    transition: color 0.2s, border-color 0.2s, background 0.2s;
  }
  .nb-navlink:hover { color: #0A0F0D; background: rgba(1,145,69,0.05); }
  .nb-navlink.active { color: #019145; border-bottom-color: #019145; }

  /* ── Desktop actions ── */
  .nb-actions { display: flex; align-items: center; gap: 10px; }
  @media (max-width: 767px) { .nb-actions { display: none; } }

  /* Primary btn */
  .nb-btn-primary {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 9px 18px; border-radius: 2px;
    background: #019145; color: #fff;
    font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase;
    border: none; cursor: pointer; text-decoration: none;
    transition: background 0.2s, transform 0.15s;
    box-shadow: 0 2px 12px rgba(1,145,69,0.25);
  }
  .nb-btn-primary:hover { background: #016934; transform: translateY(-1px); }

  /* Ghost btn */
  .nb-btn-ghost {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 8px 18px; border-radius: 2px;
    background: transparent; color: #0A0F0D;
    font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase;
    border: 1px solid rgba(1,145,69,0.20); cursor: pointer; text-decoration: none;
    transition: border-color 0.2s, background 0.2s, color 0.2s;
  }
  .nb-btn-ghost:hover { border-color: #019145; background: rgba(1,145,69,0.05); color: #019145; }

  /* ── User dropdown ── */
  .nb-user-wrap { position: relative; }
  .nb-user-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 6px 10px 6px 6px; border-radius: 2px;
    background: transparent; border: 1px solid rgba(1,145,69,0.12);
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: border-color 0.2s, background 0.2s;
  }
  .nb-user-btn:hover { border-color: rgba(1,145,69,0.30); background: rgba(1,145,69,0.04); }
  .nb-avatar {
    width: 28px; height: 28px; border-radius: 2px;
    background: rgba(1,145,69,0.10); border: 1px solid rgba(1,145,69,0.18);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .nb-user-name {
    font-size: 12px; font-weight: 600; color: #0A0F0D;
    max-width: 110px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }

  /* Dropdown */
  .nb-dropdown {
    position: absolute; right: 0; top: calc(100% + 8px);
    width: 220px;
    background: #fff;
    border: 1px solid rgba(1,145,69,0.12);
    border-radius: 2px;
    box-shadow: 0 16px 48px rgba(0,0,0,0.10);
    padding: 6px;
    opacity: 0; visibility: hidden; pointer-events: none;
    transform: translateY(-6px);
    transition: opacity 0.2s, transform 0.2s, visibility 0.2s;
  }
  .nb-user-wrap:hover .nb-dropdown {
    opacity: 1; visibility: visible; pointer-events: auto; transform: translateY(0);
  }
  .nb-dropdown-header {
    padding: 10px 12px 10px;
    border-bottom: 1px solid rgba(1,145,69,0.08);
    margin-bottom: 4px;
  }
  .nb-dropdown-name { font-size: 12px; font-weight: 700; color: #0A0F0D; margin: 0 0 2px; }
  .nb-dropdown-sub { font-size: 11px; color: #9AA8A0; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .nb-dropdown-item {
    display: flex; align-items: center; gap: 9px;
    padding: 8px 12px; width: 100%;
    font-size: 12px; font-weight: 600; color: #3A4A42;
    background: transparent; border: none; cursor: pointer;
    text-decoration: none; border-radius: 1px;
    letter-spacing: 0.04em;
    transition: background 0.15s, color 0.15s;
  }
  .nb-dropdown-item:hover { background: rgba(1,145,69,0.07); color: #019145; }
  .nb-dropdown-item.danger { color: #DC2626; }
  .nb-dropdown-item.danger:hover { background: rgba(220,38,38,0.07); color: #DC2626; }
  .nb-dropdown-divider { height: 1px; background: rgba(1,145,69,0.08); margin: 4px 0; }

  /* ── Mobile toggle ── */
  .nb-mobile-toggle {
    display: none; align-items: center; justify-content: center;
    width: 38px; height: 38px; border-radius: 2px;
    background: transparent; border: 1px solid rgba(1,145,69,0.15);
    cursor: pointer; color: #0A0F0D;
    transition: background 0.2s, border-color 0.2s, color 0.2s;
  }
  .nb-mobile-toggle:hover { background: rgba(1,145,69,0.07); border-color: #019145; color: #019145; }
  @media (max-width: 767px) { .nb-mobile-toggle { display: flex; } }

  /* ── Mobile drawer ── */
  .nb-mobile-drawer {
    border-top: 1px solid rgba(1,145,69,0.10);
    background: #fff;
    padding: 16px 20px 20px;
    display: flex; flex-direction: column; gap: 4px;
    animation: nb-slide-down 0.2s ease;
  }
  @keyframes nb-slide-down {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Mobile user card */
  .nb-m-user {
    display: flex; align-items: center; gap: 12px;
    padding: 12px; margin-bottom: 8px;
    border: 1px solid rgba(1,145,69,0.10);
    background: rgba(1,145,69,0.03);
    border-radius: 2px;
  }
  .nb-m-avatar {
    width: 38px; height: 38px; border-radius: 2px;
    background: rgba(1,145,69,0.10); border: 1px solid rgba(1,145,69,0.18);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .nb-m-name { font-size: 13px; font-weight: 700; color: #0A0F0D; margin: 0 0 2px; }
  .nb-m-role { font-size: 11px; color: #9AA8A0; margin: 0; letter-spacing: 0.06em; text-transform: uppercase; }

  /* Mobile nav items */
  .nb-m-link {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: 2px;
    font-size: 12px; font-weight: 600; letter-spacing: 0.07em; text-transform: uppercase;
    color: #3A4A42; text-decoration: none;
    border: 1px solid transparent;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
  }
  .nb-m-link:hover { background: rgba(1,145,69,0.06); color: #019145; border-color: rgba(1,145,69,0.12); }
  .nb-m-link.active { color: #019145; border-color: rgba(1,145,69,0.20); background: rgba(1,145,69,0.05); }
  .nb-m-link.green { color: #019145; background: rgba(1,145,69,0.06); border-color: rgba(1,145,69,0.18); }
  .nb-m-link.red { color: #DC2626; }
  .nb-m-link.red:hover { background: rgba(220,38,38,0.06); border-color: rgba(220,38,38,0.15); }
  .nb-m-link-btn {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: 2px; width: 100%;
    font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600;
    letter-spacing: 0.07em; text-transform: uppercase;
    background: transparent; cursor: pointer;
    border: 1px solid transparent;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
  }
  .nb-m-divider { height: 1px; background: rgba(1,145,69,0.08); margin: 6px 0; }

  /* Mobile CTA row */
  .nb-m-cta { display: flex; flex-direction: column; gap: 8px; padding-top: 8px; }
`;

export default function Navbar() {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isHome = location.pathname === "/";

  return (
    <div className="nb-root">
      <style>{navCss}</style>
      <header className={`nb-header ${scrolled ? "scrolled" : "top"}`}>
        <div className="nb-inner">
          {/* ── Logo ── */}
          <Link to="/" className="nb-logo">
            <div className="nb-logo-mark">
              <img
                src="/Chandabaz_logo.png"
                alt="ChandaBaz"
                className="nb-logo-img"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
            <span className="nb-logo-wordmark">
              Chanda<span>Baz</span>
            </span>
          </Link>

          {/* ── Desktop nav ── */}
          <nav className="nb-nav">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `nb-navlink${isActive ? " active" : ""}`
              }
            >
              Browse Reports
            </NavLink>
            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `nb-navlink${isActive ? " active" : ""}`
                }
              >
                Admin
              </NavLink>
            )}
          </nav>

          {/* ── Desktop actions ── */}
          <div className="nb-actions">
            {isLoggedIn ? (
              <>
                <Link to="/submit" className="nb-btn-primary">
                  <Plus size={14} strokeWidth={2.5} /> Submit Evidence
                </Link>

                {/* User dropdown */}
                <div className="nb-user-wrap">
                  <button className="nb-user-btn">
                    <div className="nb-avatar">
                      <User size={13} color="#019145" />
                    </div>
                    <span className="nb-user-name">{user?.name}</span>
                    <ChevronDown size={13} color="#9AA8A0" />
                  </button>

                  <div className="nb-dropdown">
                    <div className="nb-dropdown-header">
                      <p className="nb-dropdown-name">{user?.name}</p>
                      <p className="nb-dropdown-sub">
                        {user?.email || user?.phone}
                      </p>
                    </div>

                    {isAdmin && (
                      <Link to="/admin" className="nb-dropdown-item">
                        <LayoutDashboard size={13} /> Admin Dashboard
                      </Link>
                    )}
                    <div className="nb-dropdown-divider" />
                    <button
                      onClick={handleLogout}
                      className="nb-dropdown-item danger"
                    >
                      <LogOut size={13} /> Sign Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="nb-btn-ghost">
                  Sign In
                </Link>
                <Link to="/register" className="nb-btn-primary">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile toggle ── */}
          <button
            className="nb-mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* ── Mobile drawer ── */}
        {mobileOpen && (
          <div className="nb-mobile-drawer">
            {/* User card */}
            {isLoggedIn && (
              <div className="nb-m-user">
                <div className="nb-m-avatar">
                  <User size={16} color="#019145" />
                </div>
                <div>
                  <p className="nb-m-name">{user?.name}</p>
                  <p className="nb-m-role">
                    {user?.role === "admin" ? "Administrator" : "Member"}
                  </p>
                </div>
              </div>
            )}

            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `nb-m-link${isActive ? " active" : ""}`
              }
            >
              Browse Reports
            </NavLink>
            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `nb-m-link${isActive ? " active" : ""}`
                }
              >
                Admin Panel
              </NavLink>
            )}

            {isLoggedIn ? (
              <>
                <div className="nb-m-divider" />
                <Link to="/submit" className="nb-m-link green">
                  <Plus size={14} /> Submit Evidence
                </Link>
                <button
                  onClick={handleLogout}
                  className="nb-m-link-btn red nb-m-link"
                  style={{ color: "#DC2626" }}
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </>
            ) : (
              <div className="nb-m-cta">
                <div className="nb-m-divider" />
                <Link
                  to="/login"
                  className="nb-btn-ghost"
                  style={{ justifyContent: "center" }}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="nb-btn-primary"
                  style={{ justifyContent: "center" }}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </header>
    </div>
  );
}
