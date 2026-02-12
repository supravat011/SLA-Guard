import React, { useState } from 'react';
import { UserRole } from '../types';
import { ShieldCheck, Lock, Mail } from 'lucide-react';
import { api } from '../services/api';

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Call the actual backend API
      const response = await api.auth.login({ email, password });

      // Store the token in localStorage
      localStorage.setItem('auth_token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));

      // Map the backend role to UserRole enum
      const roleMap: Record<string, UserRole> = {
        'MANAGER': UserRole.MANAGER,
        'TECHNICIAN': UserRole.TECHNICIAN,
        'SENIOR_TECHNICIAN': UserRole.SENIOR_TECHNICIAN,
        'USER': UserRole.USER
      };

      const userRole = roleMap[response.user.role] || UserRole.USER;
      onLogin(userRole);
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.response?.status === 401) {
        setError('Invalid email or password');
      } else {
        setError('Login failed. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-space-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Autofill style override */}
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active{
            -webkit-box-shadow: 0 0 0 30px #151725 inset !important;
            -webkit-text-fill-color: white !important;
        }
      `}</style>

      <div className="max-w-md w-full bg-space-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden relative z-10">
        <div className="p-8 text-center bg-gradient-to-b from-brand-900/50 to-transparent border-b border-white/5">
          <div className="inline-block p-3 bg-brand-500/10 rounded-xl mb-4 border border-brand-500/20 shadow-glow">
            <ShieldCheck className="w-8 h-8 text-brand-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">SLA Guard System</h2>
          <p className="text-slate-400 mt-2 text-sm">Secure Role-Based Access Control</p>
        </div>

        <div className="p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-rose-500/10 border border-rose-500/50 text-rose-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-2 tracking-wider">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-brand-400 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-space-950/50 border border-space-border rounded-lg focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-sm text-white placeholder:text-slate-600"
                  style={{ backgroundColor: '#151725', color: 'white', WebkitTextFillColor: 'white' }}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-2 tracking-wider">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-brand-400 transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-space-950/50 border border-space-border rounded-lg focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-sm text-white placeholder:text-slate-600"
                  style={{ backgroundColor: '#151725', color: 'white', WebkitTextFillColor: 'white' }}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-500 transition-all flex items-center justify-center gap-2 mt-2 shadow-glow border border-brand-400/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying Credentials...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-slate-500">Demo credentials: All passwords are "password123"</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;