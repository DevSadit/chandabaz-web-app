import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, UserPlus, Lock, Globe, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const BENEFITS = [
  { icon: Shield, title: 'Fully Anonymous', desc: 'Report without revealing your identity' },
  { icon: Lock, title: 'Secure & Encrypted', desc: 'Your data is protected at every step' },
  { icon: Globe, title: 'Nationwide Impact', desc: 'Reach thousands of concerned citizens' },
  { icon: Star, title: 'Expert Review', desc: 'Reports verified by our moderation team' },
];

export default function Register() {
  const { register, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState('email');

  if (isLoggedIn) {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        password: form.password,
        ...(loginMethod === 'email' ? { email: form.email } : { phone: form.phone }),
      };
      await register(payload);
      toast.success('Account created! Welcome to ChandaBaz.');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 bg-neutral-950 relative overflow-hidden flex-col justify-between p-14"
        style={{ background: 'linear-gradient(135deg, #022f1a 0%, #011a0d 100%)' }}>
        <div
          className="absolute inset-0 opacity-10 mix-blend-overlay"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />
        <div className="absolute -bottom-[20%] -right-[10%] w-[500px] h-[500px] bg-primary-500/20 rounded-full blur-[80px] animate-blob" />
        <div className="absolute top-[10%] -left-[10%] w-[400px] h-[400px] bg-primary-400/20 rounded-full blur-[80px] animate-blob animation-delay-2000" />

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

          <h2 className="text-3xl font-bold text-white leading-snug mb-3">
            Join the fight<br />
            <span className="text-primary-200">against corruption.</span>
          </h2>
          <p className="text-primary-200 text-sm leading-relaxed mb-10 max-w-xs">
            Create a free account and start reporting corruption with full anonymity and security.
          </p>

          <div className="grid grid-cols-1 gap-4">
            {BENEFITS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3.5">
                <div className="w-8 h-8 rounded-lg bg-primary-500/30 flex items-center justify-center flex-shrink-0">
                  <Icon size={15} className="text-primary-200" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="text-xs text-primary-300">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-5">
          <div className="flex -space-x-2 flex-shrink-0">
            {['A', 'B', 'C'].map((l) => (
              <div key={l} className="w-8 h-8 rounded-full bg-primary-400/40 border-2 border-primary-700 flex items-center justify-center text-xs font-bold text-white">
                {l}
              </div>
            ))}
          </div>
          <div>
            <p className="text-white text-sm font-semibold">500+ reports submitted</p>
            <p className="text-primary-300 text-xs">Join our growing community of whistleblowers</p>
          </div>
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

          <div className="mb-7">
            <h1 className="text-2xl font-bold text-neutral-900 mb-1">Create your account</h1>
            <p className="text-neutral-500 text-sm">Free forever. No credit card required.</p>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input"
                  required
                  autoFocus
                />
              </div>

              {/* Method toggle */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Sign up with</label>
                <div className="flex rounded-xl border border-neutral-200 p-0.5 mb-3 bg-neutral-50">
                  {['email', 'phone'].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setLoginMethod(method)}
                      className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all capitalize ${loginMethod === method
                          ? 'bg-white shadow-sm text-primary-700 border border-neutral-200'
                          : 'text-neutral-500 hover:text-neutral-700'
                        }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>

                {loginMethod === 'email' ? (
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input"
                    required
                  />
                ) : (
                  <input
                    type="tel"
                    placeholder="03001234567"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="input"
                    required
                    pattern="[0-9]{10,15}"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    placeholder="Min. 6 characters"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="input pr-11"
                    required
                    minLength={6}
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

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Re-enter password"
                  value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  className="input"
                  required
                />
              </div>

              <div className="flex items-start gap-2.5 p-3 bg-amber-50 rounded-xl border border-amber-100">
                <input type="checkbox" required className="mt-0.5 w-4 h-4 accent-primary-600 flex-shrink-0" />
                <p className="text-xs text-amber-800 leading-relaxed">
                  I agree to report only genuine corruption evidence. False reports may result in account suspension.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors text-sm shadow-sm"
              >
                {loading ? <LoadingSpinner size="sm" /> : <UserPlus size={17} />}
                {loading ? 'Creating account...' : 'Create Free Account'}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-neutral-100 text-center">
              <p className="text-sm text-neutral-500">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-600 font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
