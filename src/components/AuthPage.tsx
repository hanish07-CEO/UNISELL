import React, { useState, useEffect } from 'react';
import { PageView, UserProfile } from '../types';

interface AuthPageProps {
  initialTab?: 'si' | 'reg';
  onNavigate: (page: PageView) => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialTab = 'si',
  onNavigate,
  onLoginSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'si' | 'reg'>(initialTab);
  const [authViewState, setAuthViewState] = useState<'form' | 'verify' | 'success'>('form');

  useEffect(() => {
    setActiveTab(initialTab);
    setAuthViewState('form');
  }, [initialTab]);

  // Sign In fields
  const [siEmail, setSiEmail] = useState('rahul@mehtaethnic.in');
  const [siPw, setSiPw] = useState('••••••••••');
  const [showSiPw, setShowSiPw] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [siError, setSiError] = useState('');
  const [siSuccess, setSiSuccess] = useState('');
  const [siLoading, setSiLoading] = useState(false);

  // Register fields
  const [rFN, setRFN] = useState('');
  const [rLN, setRLN] = useState('');
  const [rEmail, setREmail] = useState('');
  const [rBiz, setRBiz] = useState('');
  const [rPw, setRPw] = useState('');
  const [showRPw, setShowRPw] = useState(false);
  const [regError, setRegError] = useState('');
  const [regLoading, setRegLoading] = useState(false);

  // Forgot Password modal
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  // Progress bar for success animation
  const [progressWidth, setProgressWidth] = useState(0);

  // Password strength calculation
  const getPasswordStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    const colors = ['', '#f56565', '#f6a623', '#4f8ef7', '#3ecf8e'];
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong ✓'];
    return { score, color: colors[score], label: pw ? labels[score] : '' };
  };

  const pwStrength = getPasswordStrength(rPw);

  const triggerSuccessRedirect = (profile: UserProfile) => {
    setAuthViewState('success');
    setTimeout(() => setProgressWidth(100), 80);
    setTimeout(() => {
      onLoginSuccess(profile);
    }, 1100);
  };

  const handleSignIn = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSiError('');
    setSiSuccess('');

    const trimmedEmail = siEmail.trim();
    if (!trimmedEmail || !siPw) {
      setSiError('Please enter your email and password.');
      return;
    }
    if (!trimmedEmail.includes('@')) {
      setSiError('Please enter a valid email address.');
      return;
    }

    setSiLoading(true);
    setTimeout(() => {
      setSiLoading(false);
      const savedName =
        trimmedEmail.toLowerCase().startsWith('rahul')
          ? 'Rahul Mehta'
          : trimmedEmail
              .split('@')[0]
              .replace(/[._-]/g, ' ')
              .replace(/\b\w/g, (l) => l.toUpperCase());

      triggerSuccessRedirect({
        name: savedName,
        email: trimmedEmail,
        businessName: 'Mehta Ethnic House',
        plan: 'Pragati Plan',
        emailVerified: true,
      });
    }, 600);
  };

  const handleRegister = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setRegError('');

    const fn = rFN.trim();
    const ln = rLN.trim();
    const email = rEmail.trim();

    if (!fn || !ln) {
      setRegError('Please enter your first and last name.');
      return;
    }
    if (!email || !email.includes('@')) {
      setRegError('Please enter a valid email address.');
      return;
    }
    if (rPw.length < 8) {
      setRegError('Password must be at least 8 characters.');
      return;
    }

    setRegLoading(true);
    setTimeout(() => {
      setRegLoading(false);
      setAuthViewState('verify');
    }, 600);
  };

  const handleSocialAuth = (provider: 'Google' | 'Facebook') => {
    setSiError('');
    setRegError('');
    setSiLoading(true);
    setTimeout(() => {
      setSiLoading(false);
      triggerSuccessRedirect({
        name: 'Rahul Mehta',
        email: `rahul.mehta@${provider.toLowerCase()}.com`,
        businessName: rBiz.trim() || 'Mehta Ethnic House',
        plan: 'Pragati Plan',
        emailVerified: true,
      });
    }, 500);
  };

  const handleSendReset = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    const email = forgotEmail.trim();
    if (!email || !email.includes('@')) {
      setForgotError('Please enter a valid email address.');
      return;
    }
    setForgotLoading(true);
    setTimeout(() => {
      setForgotLoading(false);
      setForgotStep(2);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#090d18] text-[#e8e6e0] flex flex-col md:flex-row">
      {/* LEFT PANEL */}
      <div className="w-full md:w-[46%] lg:w-[55%] min-h-auto md:min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-6 pt-16 pb-8 md:p-12 border-b md:border-b-0 border-white/6 shrink-0">
        {/* Radial Glow */}
        <div
          className="absolute w-[500px] h-[500px] rounded-full pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            background: 'radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%)',
          }}
        />

        {/* Back to Home Link */}
        <button
          type="button"
          onClick={() => onNavigate('landing')}
          className="fixed md:absolute top-0 md:top-5 left-0 md:left-6 right-0 md:right-auto z-50 inline-flex items-center justify-center gap-1.5 text-xs text-[#7a7d8a] hover:text-[#c9a84c] bg-[#090d18]/95 md:bg-[#161d2e] border-b md:border border-white/8 hover:border-[#c9a84c]/30 py-3 md:py-1.5 px-4 rounded-none md:rounded-full transition-colors cursor-pointer"
        >
          ← Back to Home
        </button>

        {/* Orbiting Rings */}
        <div
          className="unisell-ring w-[240px] h-[240px] sm:w-[420px] sm:h-[420px] lg:w-[620px] lg:h-[620px]"
          style={{ animationDuration: '40s', animationDirection: 'reverse' }}
        >
          <div className="unisell-ring-dot" />
        </div>
        <div
          className="unisell-ring w-[340px] h-[340px] sm:w-[560px] sm:h-[560px] lg:w-[820px] lg:h-[820px]"
          style={{ animationDuration: '55s' }}
        >
          <div className="unisell-ring-dot" />
        </div>

        {/* Left Content */}
        <div className="relative z-10 text-center w-full max-w-[420px]">
          <div className="font-serif-display text-4xl lg:text-[3.3rem] font-bold text-[#c9a84c] tracking-[0.1em] mb-1">
            UNISELL
          </div>
          <div className="font-serif-display text-lg lg:text-xl italic text-[#a8aab8] mb-8">
            &ldquo;List Once, Sell Everywhere&rdquo;
          </div>

          <div className="hidden sm:flex flex-col gap-3 text-left">
            {[
              { icon: '⚡', bold: '90%', rest: 'reduction in listing time' },
              { icon: '🤖', bold: '5 AI Agents', rest: 'working 24/7' },
              { icon: '📊', bold: 'Amazon · Flipkart · Meesho · ONDC', rest: '' },
              { icon: '🇮🇳', bold: '9 Indian languages', rest: 'supported natively' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 bg-[#c9a84c]/12 border border-[#c9a84c]/25 rounded-lg px-4 py-2.5 text-sm text-[#a8aab8] transition-transform hover:translate-x-1"
              >
                <span className="text-base shrink-0">{item.icon}</span>
                <span>
                  <strong className="text-[#c9a84c]">{item.bold}</strong> {item.rest}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center mt-8 bg-[#c9a84c]/[0.08] border border-[#c9a84c]/25 rounded-xl overflow-hidden">
            <div className="flex-1 text-center py-4 px-2">
              <div className="font-serif-display text-2xl lg:text-3xl font-bold text-[#c9a84c] leading-none font-mono-code">
                63M
              </div>
              <div className="text-[0.7rem] text-[#a8aab8] mt-1 tracking-wider">Indian SMEs</div>
            </div>
            <div className="w-px h-10 bg-[#c9a84c]/25" />
            <div className="flex-1 text-center py-4 px-2">
              <div className="font-serif-display text-2xl lg:text-3xl font-bold text-[#c9a84c] leading-none font-mono-code">
                ₹345B
              </div>
              <div className="text-[0.7rem] text-[#a8aab8] mt-1 tracking-wider">Market 2030</div>
            </div>
            <div className="w-px h-10 bg-[#c9a84c]/25" />
            <div className="flex-1 text-center py-4 px-2">
              <div className="font-serif-display text-2xl lg:text-3xl font-bold text-[#c9a84c] leading-none font-mono-code">
                4.2x
              </div>
              <div className="text-[0.7rem] text-[#a8aab8] mt-1 tracking-wider">Avg ROAS</div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full md:w-[54%] lg:w-[45%] min-h-auto md:min-h-screen bg-[#0f1420] border-l border-white/6 flex flex-col items-center justify-center p-6 sm:p-10 lg:p-14 relative overflow-y-auto">
        <div className="w-full max-w-[420px]">
          {authViewState === 'form' && (
            <>
              {/* TAB BUTTONS */}
              <div className="flex gap-2.5 w-full mb-8">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('si');
                    setSiError('');
                  }}
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'si'
                      ? 'bg-[#c9a84c] text-[#090d18] border border-[#c9a84c] shadow-[0_4px_20px_rgba(201,168,76,0.3)]'
                      : 'bg-[#161d2e] text-[#7a7d8a] border border-white/6 hover:border-[#c9a84c]/25 hover:text-[#e8e6e0]'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('reg');
                    setRegError('');
                  }}
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'reg'
                      ? 'bg-[#c9a84c] text-[#090d18] border border-[#c9a84c] shadow-[0_4px_20px_rgba(201,168,76,0.3)]'
                      : 'bg-[#161d2e] text-[#7a7d8a] border border-white/6 hover:border-[#c9a84c]/25 hover:text-[#e8e6e0]'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* SIGN IN PANEL */}
              {activeTab === 'si' && (
                <form onSubmit={handleSignIn} className="unisell-fade-up">
                  <div className="font-mono-code text-[0.65rem] text-[#c9a84c] tracking-[0.2em] uppercase mb-1.5">
                    Welcome Back
                  </div>
                  <h1 className="font-serif-display text-3xl sm:text-4xl font-bold leading-[1.1] mb-1.5">
                    Sign in to your
                    <br />
                    <span className="text-[#c9a84c] italic">Command Center</span>
                  </h1>
                  <p className="text-[#7a7d8a] text-sm mb-6">
                    Manage your store across all platforms
                  </p>

                  {siError && (
                    <div className="bg-[#f56565]/10 border border-[#f56565]/30 rounded-lg px-4 py-2.5 text-xs text-[#f56565] mb-4">
                      {siError}
                    </div>
                  )}
                  {siSuccess && (
                    <div className="bg-[#3ecf8e]/10 border border-[#3ecf8e]/30 rounded-lg px-4 py-2.5 text-xs text-[#3ecf8e] mb-4">
                      {siSuccess}
                    </div>
                  )}

                  <div className="mb-4">
                    <label
                      htmlFor="siEmail"
                      className="block text-xs text-[#7a7d8a] mb-1.5"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#7a7d8a]">
                        ✉
                      </span>
                      <input
                        id="siEmail"
                        type="email"
                        value={siEmail}
                        onChange={(e) => setSiEmail(e.target.value)}
                        placeholder="you@business.com"
                        className="w-full bg-[#161d2e] border border-white/8 focus:border-[#c9a84c]/40 rounded-lg py-2.5 pl-9 pr-4 text-sm text-[#e8e6e0] outline-none"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="siPw"
                      className="block text-xs text-[#7a7d8a] mb-1.5"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#7a7d8a]">
                        🔒
                      </span>
                      <input
                        id="siPw"
                        type={showSiPw ? 'text' : 'password'}
                        value={siPw}
                        onChange={(e) => setSiPw(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#161d2e] border border-white/8 focus:border-[#c9a84c]/40 rounded-lg py-2.5 pl-9 pr-10 text-sm text-[#e8e6e0] outline-none"
                      />
                      <button
                        type="button"
                        aria-label="Toggle password visibility"
                        onClick={() => setShowSiPw((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-[#7a7d8a] hover:text-[#c9a84c] cursor-pointer text-sm"
                      >
                        {showSiPw ? '🙈' : '👁'}
                      </button>
                    </div>
                    <div className="text-right mt-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setForgotOpen(true);
                          setForgotStep(1);
                          setForgotError('');
                        }}
                        className="text-xs text-[#c9a84c] hover:underline bg-transparent border-none cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <input
                      id="rememberMe"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 accent-[#c9a84c] cursor-pointer"
                    />
                    <label htmlFor="rememberMe" className="text-xs text-[#7a7d8a] cursor-pointer">
                      Remember me on this device
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={siLoading}
                    className="w-full py-3.5 mt-5 rounded-lg font-bold text-sm text-[#090d18] bg-[#c9a84c] hover:bg-[#e8c97a] transition-all cursor-pointer border-none shadow-[0_4px_20px_rgba(201,168,76,0.3)]"
                  >
                    {siLoading ? 'Signing in...' : 'Sign In to Dashboard →'}
                  </button>

                  <div className="flex items-center gap-4 my-5">
                    <div className="flex-1 h-px bg-white/8" />
                    <span className="text-xs text-[#7a7d8a]">or continue with</span>
                    <div className="flex-1 h-px bg-white/8" />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleSocialAuth('Google')}
                      className="py-2.5 px-3 bg-[#161d2e] border border-white/8 hover:border-[#4285f4] hover:text-[#4285f4] rounded-lg text-xs font-medium text-[#a8aab8] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      Google
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSocialAuth('Facebook')}
                      className="py-2.5 px-3 bg-[#161d2e] border border-white/8 hover:border-[#1877f2] hover:text-[#1877f2] rounded-lg text-xs font-medium text-[#a8aab8] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24">
                        <path
                          d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                          fill="#1877f2"
                        />
                      </svg>
                      Facebook
                    </button>
                  </div>

                  <div className="text-[0.72rem] text-[#7a7d8a] text-center mt-5">
                    By signing in you agree to our{' '}
                    <span className="text-[#c9a84c]">Terms</span> and{' '}
                    <span className="text-[#c9a84c]">Privacy Policy</span>
                  </div>
                  <div className="font-mono-code text-[0.7rem] text-[#7a7d8a] text-center mt-4 tracking-wider">
                    ✦ UNISELL · Hanish
                  </div>
                </form>
              )}

              {/* CREATE ACCOUNT PANEL */}
              {activeTab === 'reg' && (
                <form onSubmit={handleRegister} className="unisell-fade-up">
                  <div className="font-mono-code text-[0.65rem] text-[#c9a84c] tracking-[0.2em] uppercase mb-1.5">
                    Get Started Free
                  </div>
                  <h1 className="font-serif-display text-3xl sm:text-4xl font-bold leading-[1.1] mb-1.5">
                    Create your
                    <br />
                    <span className="text-[#c9a84c] italic">UNISELL Account</span>
                  </h1>
                  <p className="text-[#7a7d8a] text-sm mb-6">
                    14-day free trial · No credit card required
                  </p>

                  {regError && (
                    <div className="bg-[#f56565]/10 border border-[#f56565]/30 rounded-lg px-4 py-2.5 text-xs text-[#f56565] mb-4">
                      {regError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3.5">
                    <div>
                      <label htmlFor="rFN" className="block text-xs text-[#7a7d8a] mb-1.5">
                        First Name
                      </label>
                      <input
                        id="rFN"
                        type="text"
                        value={rFN}
                        onChange={(e) => setRFN(e.target.value)}
                        placeholder="Rahul"
                        className="w-full bg-[#161d2e] border border-white/8 focus:border-[#c9a84c]/40 rounded-lg py-2.5 px-3.5 text-sm text-[#e8e6e0] outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="rLN" className="block text-xs text-[#7a7d8a] mb-1.5">
                        Last Name
                      </label>
                      <input
                        id="rLN"
                        type="text"
                        value={rLN}
                        onChange={(e) => setRLN(e.target.value)}
                        placeholder="Mehta"
                        className="w-full bg-[#161d2e] border border-white/8 focus:border-[#c9a84c]/40 rounded-lg py-2.5 px-3.5 text-sm text-[#e8e6e0] outline-none"
                      />
                    </div>
                  </div>

                  <div className="mb-3.5">
                    <label htmlFor="rEmail" className="block text-xs text-[#7a7d8a] mb-1.5">
                      Business Email
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#7a7d8a]">
                        ✉
                      </span>
                      <input
                        id="rEmail"
                        type="email"
                        value={rEmail}
                        onChange={(e) => setREmail(e.target.value)}
                        placeholder="you@business.com"
                        className="w-full bg-[#161d2e] border border-white/8 focus:border-[#c9a84c]/40 rounded-lg py-2.5 pl-9 pr-4 text-sm text-[#e8e6e0] outline-none"
                      />
                    </div>
                  </div>

                  <div className="mb-3.5">
                    <label htmlFor="rBiz" className="block text-xs text-[#7a7d8a] mb-1.5">
                      Business Name <span className="text-[0.68rem]">(optional)</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#7a7d8a]">
                        🏪
                      </span>
                      <input
                        id="rBiz"
                        type="text"
                        value={rBiz}
                        onChange={(e) => setRBiz(e.target.value)}
                        placeholder="Your Store Name"
                        className="w-full bg-[#161d2e] border border-white/8 focus:border-[#c9a84c]/40 rounded-lg py-2.5 pl-9 pr-4 text-sm text-[#e8e6e0] outline-none"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="rPw" className="block text-xs text-[#7a7d8a] mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#7a7d8a]">
                        🔒
                      </span>
                      <input
                        id="rPw"
                        type={showRPw ? 'text' : 'password'}
                        value={rPw}
                        onChange={(e) => setRPw(e.target.value)}
                        placeholder="Min 8 characters"
                        className="w-full bg-[#161d2e] border border-white/8 focus:border-[#c9a84c]/40 rounded-lg py-2.5 pl-9 pr-10 text-sm text-[#e8e6e0] outline-none"
                      />
                      <button
                        type="button"
                        aria-label="Toggle password visibility"
                        onClick={() => setShowRPw((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-[#7a7d8a] hover:text-[#c9a84c] cursor-pointer text-sm"
                      >
                        {showRPw ? '🙈' : '👁'}
                      </button>
                    </div>
                    <div className="flex gap-1 mt-2">
                      {[1, 2, 3, 4].map((seg) => (
                        <div
                          key={seg}
                          className="flex-1 h-1 rounded transition-colors"
                          style={{
                            backgroundColor:
                              seg <= pwStrength.score ? pwStrength.color : 'rgba(255,255,255,0.06)',
                          }}
                        />
                      ))}
                    </div>
                    {pwStrength.label && (
                      <div className="text-[0.68rem] mt-1" style={{ color: pwStrength.color }}>
                        {pwStrength.label}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={regLoading}
                    className="w-full py-3.5 mt-2 rounded-lg font-bold text-sm text-[#090d18] bg-[#c9a84c] hover:bg-[#e8c97a] transition-all cursor-pointer border-none shadow-[0_4px_20px_rgba(201,168,76,0.3)]"
                  >
                    {regLoading ? 'Creating Account...' : 'Create Account →'}
                  </button>

                  <div className="flex items-center gap-4 my-5">
                    <div className="flex-1 h-px bg-white/8" />
                    <span className="text-xs text-[#7a7d8a]">or sign up with</span>
                    <div className="flex-1 h-px bg-white/8" />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleSocialAuth('Google')}
                      className="py-2.5 px-3 bg-[#161d2e] border border-white/8 hover:border-[#4285f4] hover:text-[#4285f4] rounded-lg text-xs font-medium text-[#a8aab8] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      Google
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSocialAuth('Facebook')}
                      className="py-2.5 px-3 bg-[#161d2e] border border-white/8 hover:border-[#1877f2] hover:text-[#1877f2] rounded-lg text-xs font-medium text-[#a8aab8] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      Facebook
                    </button>
                  </div>

                  <div className="text-[0.72rem] text-[#7a7d8a] text-center mt-5">
                    By creating an account you agree to our{' '}
                    <span className="text-[#c9a84c]">Terms</span> and{' '}
                    <span className="text-[#c9a84c]">Privacy Policy</span>
                  </div>
                  <div className="font-mono-code text-[0.7rem] text-[#7a7d8a] text-center mt-4 tracking-wider">
                    ✦ UNISELL · Hanish
                  </div>
                </form>
              )}
            </>
          )}

          {/* VERIFY EMAIL STATE */}
          {authViewState === 'verify' && (
            <div className="flex flex-col items-center justify-center text-center py-8 unisell-fade-up">
              <div className="text-5xl mb-4">📧</div>
              <h2 className="font-serif-display text-3xl font-bold text-[#c9a84c] mb-2">
                Check your email!
              </h2>
              <p className="text-sm text-[#7a7d8a] mb-6 leading-relaxed">
                We sent a confirmation link to
                <br />
                <span className="text-[#c9a84c] font-semibold">{rEmail}</span>
                <br />
                <br />
                Click the link in the email to verify your account, or continue directly to your Command Center below.
              </p>
              <button
                type="button"
                onClick={() =>
                  triggerSuccessRedirect({
                    name: `${rFN.trim()} ${rLN.trim()}`.trim() || 'Rahul Mehta',
                    email: rEmail.trim(),
                    businessName: rBiz.trim() || 'Mehta Ethnic House',
                    plan: 'Pragati Plan',
                    emailVerified: true,
                  })
                }
                className="w-full py-3.5 rounded-lg font-bold text-sm text-[#090d18] bg-[#c9a84c] hover:bg-[#e8c97a] transition-all cursor-pointer border-none mb-3"
              >
                Continue to Command Center →
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthViewState('form');
                  setActiveTab('si');
                }}
                className="text-xs text-[#7a7d8a] hover:text-[#c9a84c] underline bg-transparent border-none cursor-pointer mt-2"
              >
                ← Back to Sign In
              </button>
            </div>
          )}

          {/* SUCCESS STATE */}
          {authViewState === 'success' && (
            <div className="flex flex-col items-center justify-center text-center py-10 unisell-fade-up">
              <div className="text-5xl text-[#c9a84c] mb-4">✦</div>
              <h2 className="font-serif-display text-4xl font-bold text-[#c9a84c] mb-2">
                Welcome to UNISELL!
              </h2>
              <p className="text-sm text-[#7a7d8a] mb-8 leading-relaxed">
                Your command center is ready.
                <br />
                Taking you there now...
              </p>
              <div className="w-[220px] h-1 bg-white/8 rounded overflow-hidden">
                <div
                  className="h-full rounded transition-all duration-1000"
                  style={{
                    width: `${progressWidth}%`,
                    background: 'linear-gradient(90deg, #c9a84c, #e8c97a)',
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      {forgotOpen && (
        <div
          onClick={() => setForgotOpen(false)}
          className="fixed inset-0 bg-[#090d18]/88 backdrop-blur-md flex items-center justify-center z-[1000] p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0f1420] border border-[#c9a84c]/30 rounded-2xl p-8 w-full max-w-[440px] relative shadow-2xl"
          >
            <button
              type="button"
              aria-label="Close forgot password modal"
              onClick={() => setForgotOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#161d2e] border border-white/8 text-[#7a7d8a] hover:text-[#c9a84c] flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>

            <div className="flex gap-1.5 mb-6">
              <div className="flex-1 h-1 rounded bg-[#c9a84c]" />
              <div
                className={`flex-1 h-1 rounded transition-colors ${
                  forgotStep === 2 ? 'bg-[#c9a84c]' : 'bg-white/8'
                }`}
              />
            </div>

            {forgotStep === 1 ? (
              <form onSubmit={handleSendReset}>
                <h2 className="font-serif-display text-3xl font-bold mb-1">
                  Forgot your
                  <br />
                  <span className="text-[#c9a84c] italic">Password?</span>
                </h2>
                <p className="text-xs text-[#7a7d8a] mb-5">
                  Enter your email and we&apos;ll send a password reset link directly to your inbox.
                </p>

                {forgotError && (
                  <div className="bg-[#f56565]/10 border border-[#f56565]/30 rounded-lg px-3.5 py-2 text-xs text-[#f56565] mb-4">
                    {forgotError}
                  </div>
                )}

                <div className="mb-4">
                  <label htmlFor="fEmail" className="block text-xs text-[#7a7d8a] mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#7a7d8a]">
                      ✉
                    </span>
                    <input
                      id="fEmail"
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="you@business.com"
                      className="w-full bg-[#161d2e] border border-white/8 focus:border-[#c9a84c]/40 rounded-lg py-2.5 pl-9 pr-4 text-sm text-[#e8e6e0] outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3.5 rounded-lg font-bold text-sm text-[#090d18] bg-[#c9a84c] hover:bg-[#e8c97a] cursor-pointer border-none"
                >
                  {forgotLoading ? 'Sending...' : 'Send Reset Link →'}
                </button>
              </form>
            ) : (
              <div className="text-center py-4">
                <div className="text-5xl mb-3">📬</div>
                <h2 className="font-serif-display text-3xl font-bold mb-1">
                  Email <span className="text-[#c9a84c] italic">Sent!</span>
                </h2>
                <p className="text-xs text-[#7a7d8a] mb-2">
                  Reset link sent to <strong className="text-[#c9a84c]">{forgotEmail}</strong>. Check your inbox!
                </p>
                <p className="text-xs text-[#7a7d8a] mb-5">
                  Also check your spam folder. The link expires in 1 hour.
                </p>
                <button
                  type="button"
                  onClick={() => setForgotStep(1)}
                  className="bg-transparent border border-[#c9a84c]/30 text-[#c9a84c] rounded-lg px-4 py-2 text-xs cursor-pointer hover:bg-[#c9a84c]/15"
                >
                  Send to different email
                </button>
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => setForgotOpen(false)}
                    className="text-xs text-[#7a7d8a] hover:text-[#c9a84c] underline bg-transparent border-none cursor-pointer"
                  >
                    Back to Sign In
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
