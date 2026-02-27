import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Eye, EyeOff, LogIn, FileText, Users, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const TRUST_POINTS = [
  { icon: Shield, text: 'End-to-end secure reporting' },
  { icon: FileText, text: 'Multi-media evidence support' },
  { icon: Users, text: 'Verified by expert moderators' },
  { icon: CheckCircle, text: 'Anonymous submission option' },
];

export default function Login() {
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ emailOrPhone: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  if (isLoggedIn) {
    navigate(from, { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const isEmail = form.emailOrPhone.includes('@');
      const creds = {
        password: form.password,
        ...(isEmail ? { email: form.emailOrPhone } : { phone: form.emailOrPhone }),
      };
      await login(creds);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 bg-neutral-950 relative overflow-hidden flex-col justify-between p-14"
        style={{ background: 'linear-gradient(135deg, #022f1a 0%, #011a0d 100%)' }}>
        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-10 mix-blend-overlay"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />
        {/* Glow */}
        <div className="absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] bg-primary-500/20 rounded-full blur-[80px] animate-blob" />
        <div className="absolute -top-[10%] -right-[10%] w-[400px] h-[400px] bg-primary-400/20 rounded-full blur-[80px] animate-blob animation-delay-2000" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 bg-white/5 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10 shadow-inner-light">
              <Shield size={24} className="text-white drop-shadow-sm" />
            </div>
            <div>
              <span className="text-white font-bold text-xl tracking-tight">ChandaBaz</span>
              <p className="text-primary-200 text-xs">Transparency Platform</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white leading-snug mb-4">
            Fight corruption.<br />
            <span className="text-primary-200">Your voice matters.</span>
          </h2>
          <p className="text-primary-200 text-sm leading-relaxed mb-10 max-w-xs">
            Join thousands of citizens holding power to account with verified, anonymous evidence.
          </p>

          <div className="space-y-4">
            {TRUST_POINTS.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={13} className="text-primary-200" />
                </div>
                <p className="text-sm text-primary-100">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <div className="relative bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="text-sm text-primary-100 italic leading-relaxed">
            "Corruption thrives in darkness. Every report you make is a beam of light."
          </p>
          <p className="text-xs text-primary-300 mt-2 font-medium">— ChandaBaz Mission</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center bg-neutral-50 px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
              <Shield size={18} className="text-white" />
            </div>
            <span className="font-bold text-neutral-900 text-lg">ChandaBaz</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-neutral-900 mb-1">Welcome back</h1>
            <p className="text-neutral-500 text-sm">Sign in to your account to continue</p>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email or Phone</label>
                <input
                  type="text"
                  placeholder="you@example.com or 03001234567"
                  value={form.emailOrPhone}
                  onChange={(e) => setForm({ ...form, emailOrPhone: e.target.value })}
                  className="input"
                  required
                  autoFocus
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-neutral-700">Password</label>
                </div>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="input pr-11"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-700 transition-colors"
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors text-sm shadow-sm"
              >
                {loading ? <LoadingSpinner size="sm" /> : <LogIn size={17} />}
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-neutral-100 text-center">
              <p className="text-sm text-neutral-500">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary-600 font-semibold hover:underline">
                  Create one free
                </Link>
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-neutral-400 mt-6">
            By signing in you agree to our terms of service and privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
}
