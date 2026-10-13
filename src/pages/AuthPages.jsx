import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Alert from '../components/ui/Alert';

// ─── LOGIN SCREEN [Hala] ────────────────────────────────────────────────────────
export function LoginPage() {
  const [email, setEmail] = useState('admin@judgeflow.org');
  const [password, setPassword] = useState('••••••••••');
  const [role, setRole] = useState('ADMIN');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setSuccess(true);
  };

  return (
    <div className="space-y-6 max-w-md mx-auto pb-12">
      <PageHeader
        owner="Hala"
        featureModule="Module 1: Authentication & Role Navigation"
        title="Admin & Judge Login"
        description="Credentials authentication screen with token storage and session initialization."
        route="/login"
      />

      <div className="glass-card p-8">
        {success ? (
          <div className="space-y-4">
            <Alert
              type="success"
              title="Authentication Successful"
              message={`Logged in as ${role} (${email}). Session token generated.`}
            />
            <Button
              variant="primary"
              className="w-full"
              onClick={() => navigate('/admin/competitions/new')}
            >
              Continue to Admin Setup (Mostafa khaled)
            </Button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-5">
            <Input
              id="login-email"
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@judgeflow.org"
            />
            <Input
              id="login-password"
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-surface-300">Role Selection</label>
              <div className="grid grid-cols-2 gap-2">
                {['ADMIN', 'JUDGE'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                      role === r
                        ? 'bg-primary-600 text-white border-primary-500'
                        : 'bg-surface-800 text-surface-400 border-surface-700 hover:text-white'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" variant="primary" className="w-full">
              Sign In to Platform
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── REGISTER SCREEN [Hala] ─────────────────────────────────────────────────────
export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('JUDGE');
  const [submitted, setSubmitted] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-6 max-w-md mx-auto pb-12">
      <PageHeader
        owner="Hala"
        featureModule="Module 1: Authentication & Role Navigation"
        title="Account Registration"
        description="Register new platform evaluators and administrators with role-specific privileges."
        route="/register"
      />

      <div className="glass-card p-8">
        {submitted ? (
          <Alert
            type="success"
            title="Registration Request Received"
            message={`New ${role} account for ${name} (${email}) has been submitted for admin approval.`}
          />
        ) : (
          <form onSubmit={handleRegister} className="space-y-5">
            <Input
              id="reg-name"
              label="Full Name"
              placeholder="Dr. Jane Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              id="reg-email"
              type="email"
              label="Academic / Institutional Email"
              placeholder="jane@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-surface-300">Account Type</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2.5 bg-surface-800 border border-surface-700 rounded-xl text-surface-200 text-sm focus:outline-none"
              >
                <option value="JUDGE">Competition Judge</option>
                <option value="ADMIN">Platform Admin</option>
              </select>
            </div>
            <Button type="submit" variant="primary" className="w-full">
              Create Account
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── ROLE-BASED NAVIGATION & LOGOUT STATE [Abdallah / Hala] ─────────────────────
export function RoleNavigationPage() {
  const [currentRole, setCurrentRole] = useState('ADMIN');
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <PageHeader
        owner="Abdallah"
        featureModule="Module 1: Authentication & Role Navigation"
        title="Role-Based Navigation & Route Guards"
        description="State machine and route guards controlling accessibility per user role: ADMIN, JUDGE, PARTICIPANT, and logged-out state."
        route="/role-navigation"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 space-y-4">
          <h3 className="text-base font-bold text-surface-100">Live Role Simulator</h3>
          <p className="text-xs text-surface-400">
            Switch the active session role to test navigation permission barriers across the prototype.
          </p>

          <div className="space-y-2">
            {['ADMIN', 'JUDGE', 'PARTICIPANT'].map((r) => (
              <button
                key={r}
                onClick={() => {
                  setCurrentRole(r);
                  setIsLoggedOut(false);
                }}
                className={`w-full p-3 rounded-xl border text-left flex items-center justify-between text-xs font-semibold transition-all cursor-pointer ${
                  !isLoggedOut && currentRole === r
                    ? 'bg-primary-600/20 border-primary-500 text-primary-300'
                    : 'bg-surface-800/60 border-surface-700 text-surface-400 hover:text-white'
                }`}
              >
                <span>Role: {r}</span>
                <span className="text-[10px] font-mono uppercase">
                  {!isLoggedOut && currentRole === r ? '● ACTIVE' : 'Switch'}
                </span>
              </button>
            ))}

            <button
              onClick={() => setIsLoggedOut(true)}
              className={`w-full p-3 rounded-xl border text-left flex items-center justify-between text-xs font-semibold transition-all cursor-pointer ${
                isLoggedOut
                  ? 'bg-danger-600/20 border-danger-500 text-danger-300'
                  : 'bg-surface-800/60 border-surface-700 text-surface-400 hover:text-danger-300'
              }`}
            >
              <span>Logout State (Guest)</span>
              <span className="text-[10px] font-mono uppercase">
                {isLoggedOut ? '● LOGGED OUT' : 'Trigger Logout'}
              </span>
            </button>
          </div>
        </div>

        <div className="glass-card p-6 space-y-4">
          <h3 className="text-base font-bold text-surface-100">Route Access Table</h3>
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-surface-900 rounded-xl border border-surface-800 flex justify-between items-center">
              <div>
                <p className="font-bold text-surface-200">/admin/* (Competition & Teams)</p>
                <p className="text-[11px] text-surface-400">Owner: Mostafa khaled & Yousef</p>
              </div>
              <span className={currentRole === 'ADMIN' && !isLoggedOut ? 'text-emerald-400 font-bold' : 'text-danger-400'}>
                {currentRole === 'ADMIN' && !isLoggedOut ? 'ALLOWED' : 'BLOCKED'}
              </span>
            </div>

            <div className="p-3 bg-surface-900 rounded-xl border border-surface-800 flex justify-between items-center">
              <div>
                <p className="font-bold text-surface-200">/judge/* (Evaluation & Scoring)</p>
                <p className="text-[11px] text-surface-400">Owner: Omar Mustafa & Lubna</p>
              </div>
              <span className={(currentRole === 'ADMIN' || currentRole === 'JUDGE') && !isLoggedOut ? 'text-emerald-400 font-bold' : 'text-danger-400'}>
                {(currentRole === 'ADMIN' || currentRole === 'JUDGE') && !isLoggedOut ? 'ALLOWED' : 'BLOCKED'}
              </span>
            </div>

            <div className="p-3 bg-surface-900 rounded-xl border border-surface-800 flex justify-between items-center">
              <div>
                <p className="font-bold text-surface-200">/public/results (Public Leaderboard)</p>
                <p className="text-[11px] text-surface-400">Owner: Kermin</p>
              </div>
              <span className="text-emerald-400 font-bold">PUBLIC</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
