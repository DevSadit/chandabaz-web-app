import { Link } from 'react-router-dom';
import { Shield, Mail, Phone, MapPin, ArrowRight, Eye, FileCheck, Users } from 'lucide-react';

const footerLinks = {
  Platform: [
    { label: 'Browse Reports', to: '/' },
    { label: 'Submit Evidence', to: '/submit' },
    { label: 'Create Account', to: '/register' },
    { label: 'Sign In', to: '/login' },
  ],
  About: [
    { label: 'Our Mission', to: '/#mission' },
    { label: 'How It Works', to: '/#how' },
    { label: 'Privacy Policy', to: '/' },
    { label: 'Terms of Use', to: '/' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-white mt-auto">
      {/* CTA Strip */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="container-app py-12 relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-white">Ready to expose corruption?</h3>
              <p className="text-primary-200 text-sm mt-1">Your evidence can make a difference. Submit anonymously — safely.</p>
            </div>
            <Link to="/submit" className="btn-outline-white flex-shrink-0">
              Submit Evidence
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-app py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-5 group">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center group-hover:bg-primary-500 transition-colors">
                <Shield size={20} className="text-white" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-white tracking-tight">
                  Chanda<span className="text-primary-400">Baz</span>
                </span>
                <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium">Transparency Platform</p>
              </div>
            </Link>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-sm mb-6">
              ChandaBaz is a citizen-powered platform for reporting and documenting public corruption with verified evidence. Every report is reviewed, every identity is protected.
            </p>
            {/* Trust badges */}
            <div className="flex flex-wrap gap-3">
              {[
                { icon: Eye, text: '100% Anonymous option' },
                { icon: FileCheck, text: 'Every report reviewed' },
                { icon: Users, text: 'Community powered' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 rounded-full text-xs text-neutral-300">
                  <Icon size={12} className="text-primary-400" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">{heading}</h4>
              <ul className="space-y-2.5">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-sm text-neutral-400 hover:text-primary-400 transition-colors duration-150 flex items-center gap-1.5 group"
                    >
                      <span className="w-0 group-hover:w-2 h-px bg-primary-500 transition-all duration-200 overflow-hidden" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-500">
            &copy; {new Date().getFullYear()} ChandaBaz — All rights reserved.
          </p>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse-slow" />
            <p className="text-xs text-neutral-500">
              Platform is live · Reports reviewed within 24 hours
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
