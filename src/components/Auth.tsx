import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, User, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Auth() {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('admin@securestock.com');
  const [password, setPassword] = useState('password123');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Simulate network delay
    setTimeout(() => {
      login(email);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-brand-200">
              <ShieldCheck className="text-white w-10 h-10" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">SecureStock</h1>
            <p className="text-slate-500 text-center mt-2">
              {isLogin ? 'Welcome back! (Demo Mode)' : 'Create your account (Demo Mode)'}
            </p>
          </div>

          <div className="mb-6 p-4 bg-brand-50 border border-brand-100 text-brand-700 rounded-xl text-sm">
            <strong>Demo Credentials:</strong><br />
            Email: admin@securestock.com<br />
            Password: any
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    required
                    className="input pl-11"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="email"
                  required
                  className="input pl-11"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="password"
                  required
                  className="input pl-11"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3 text-lg"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-brand-600 font-semibold hover:text-brand-700 transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
        
        <div className="bg-slate-50 p-6 border-t border-slate-100">
          <p className="text-xs text-slate-500 text-center leading-relaxed">
            SecureStock Demo Mode. No data is sent to a server.
          </p>
        </div>
      </div>
    </div>
  );
}
