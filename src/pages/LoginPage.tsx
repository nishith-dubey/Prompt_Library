import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Sparkles, Mail, Lock, Loader2, ArrowRight, UserCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { success, error } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      error('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/auth/login', {
        email: email.trim(),
        password
      });

      if (res.data.success) {
        login(res.data.token, res.data.user);
        success(`Welcome back, ${res.data.user.name}!`);
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoEmail: string) => {
    try {
      setLoading(true);
      const res = await api.post('/auth/login', {
        email: demoEmail,
        password: 'password123'
      });

      if (res.data.success) {
        login(res.data.token, res.data.user);
        success(`Logged in as ${res.data.user.name} (${res.data.user.role})`);
        navigate('/dashboard');
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[#F9FAFB] text-gray-900">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 text-white shadow-xs mb-1">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">
            Sign In to Prompt Library
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm">
            Access your curated collections, rate prompts, and share workflow blueprints.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-xs space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shadow-xs active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Test Accounts */}
          <div className="pt-4 border-t border-gray-100 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
              <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Instant Demo Accounts (One-Click Login):</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('rahul@promptlibrary.dev')}
                className="p-2 rounded-lg border border-gray-200 bg-gray-50 hover:bg-indigo-50/50 hover:border-indigo-300 text-left transition-colors text-xs"
              >
                <div className="font-semibold text-gray-800">Rahul Sharma</div>
                <div className="text-[11px] text-indigo-700">AI Expert</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('sarah@promptlibrary.dev')}
                className="p-2 rounded-lg border border-gray-200 bg-gray-50 hover:bg-indigo-50/50 hover:border-indigo-300 text-left transition-colors text-xs"
              >
                <div className="font-semibold text-gray-800">Sarah Chen</div>
                <div className="text-[11px] text-indigo-700">Developer</div>
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500">
          Don't have an account yet?{' '}
          <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-800 underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};
