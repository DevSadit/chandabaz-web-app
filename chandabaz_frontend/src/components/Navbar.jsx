import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Shield, LogOut, User, Plus, LayoutDashboard, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  const handleLogout = () => { logout(); navigate('/'); };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-semibold transition-colors duration-150 pb-0.5 border-b-2 ${isActive ? 'text-primary-600 border-primary-600' : 'text-neutral-500 border-transparent hover:text-neutral-900 hover:border-neutral-300'
    }`;

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/85 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] border-neutral-200/50' : 'bg-white/60 backdrop-blur-md border-transparent'
      } border-b`}>
      <div className="container-app">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="relative w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-[14px] flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
              <Shield size={20} className="text-white drop-shadow-sm" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm animate-pulse-slow" />
            </div>
            <div className="leading-none">
              <span className="text-xl font-black text-neutral-900 tracking-tight">
                Chanda<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">Baz</span>
              </span>
              <p className="text-[10px] text-neutral-500 font-bold tracking-[0.2em] uppercase mt-0.5">Transparency</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7">
            <NavLink to="/" end className={navLinkClass}>Browse Reports</NavLink>
            {isAdmin && <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <Link to="/submit" className="btn-primary gap-2">
                  <Plus size={16} strokeWidth={2.5} />
                  Submit Evidence
                </Link>
                <div className="relative group">
                  <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-neutral-50 border border-transparent hover:border-neutral-200 transition-all duration-150">
                    <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center">
                      <User size={14} className="text-primary-700" />
                    </div>
                    <span className="text-sm font-semibold text-neutral-700 max-w-[110px] truncate">{user?.name}</span>
                    <ChevronDown size={14} className="text-neutral-400" />
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border border-neutral-100 shadow-lg py-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-right scale-95 group-hover:scale-100">
                    <div className="px-4 py-2.5 border-b border-neutral-100 mb-1">
                      <p className="text-xs font-bold text-neutral-900 truncate">{user?.name}</p>
                      <p className="text-xs text-neutral-400 truncate">{user?.email || user?.phone}</p>
                    </div>
                    {isAdmin && (
                      <Link to="/admin" className="flex items-center gap-2.5 px-4 py-2 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-700 rounded-xl mx-1 transition-colors">
                        <LayoutDashboard size={14} /> Admin Dashboard
                      </Link>
                    )}
                    <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl mx-1 transition-colors">
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-neutral-100 bg-white/95 backdrop-blur-md animate-slide-up">
          <div className="container-app py-4 space-y-1">
            {isLoggedIn && (
              <div className="flex items-center gap-3 p-3 mb-3 bg-primary-50 rounded-2xl">
                <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center">
                  <User size={16} className="text-primary-700" />
                </div>
                <div>
                  <p className="text-sm font-bold text-neutral-900">{user?.name}</p>
                  <p className="text-xs text-neutral-500">{user?.role === 'admin' ? 'Administrator' : 'Member'}</p>
                </div>
              </div>
            )}
            <NavLink to="/" end className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-neutral-700 rounded-xl hover:bg-neutral-50 hover:text-primary-700">Browse Reports</NavLink>
            {isAdmin && <NavLink to="/admin" className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-neutral-700 rounded-xl hover:bg-neutral-50">Admin Panel</NavLink>}
            {isLoggedIn ? (
              <>
                <Link to="/submit" className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-primary-700 rounded-xl bg-primary-50">
                  <Plus size={15} /> Submit Evidence
                </Link>
                <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-red-600 rounded-xl hover:bg-red-50">
                  <LogOut size={15} /> Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link to="/login" className="btn-secondary w-full justify-center">Sign In</Link>
                <Link to="/register" className="btn-primary w-full justify-center">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
