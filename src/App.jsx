import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { PlatformProvider, usePlatform } from './context/PlatformContext';
import DevNavbar from './components/dev/DevNavbar';

// Page imports
import DeveloperOverviewPage from './pages/DeveloperOverviewPage';
import AdminCompetitionNewPage from './pages/AdminCompetitionNewPage';
import AdminActiveControlPage from './pages/AdminActiveControlPage';
import AdminCompetitionEditPage from './pages/AdminCompetitionEditPage';
import RubricConfigPage from './pages/RubricConfigPage';
import { LoginPage, RegisterPage, RoleNavigationPage } from './pages/AuthPages';
import {
  ParticipantRegisterPage,
  AdminParticipantsPage,
  AdminTeamsPage,
} from './pages/ParticipantPages';
import {
  JudgeDashboardPage,
  JudgeEvaluatePage,
  JudgeValidationPage,
} from './pages/JudgePages';
import {
  AdminRankingsPage,
  PublicResultsPage,
  TieResolutionPage,
} from './pages/ResultsPages';

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { selectedCompetitionId, currentCompetition, activeTeam } = usePlatform();
  const location = useLocation();

  const compId = selectedCompetitionId || 'comp-002';

  const sidebarLinks = [
    {
      to: '/',
      label: 'Developer Overview',
      owner: 'All',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      to: '/admin/competitions/new',
      label: 'Create Competition',
      owner: 'Mostafa khaled',
      isMyScope: true,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
    },
    {
      to: `/admin/competitions/${compId}/active-control`,
      label: 'Active-Team Controls',
      owner: 'Mostafa khaled',
      isMyScope: true,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      to: `/admin/competitions/${compId}/edit`,
      label: 'Update Competition',
      owner: 'Mostafa khaled',
      isMyScope: true,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      to: `/admin/competitions/${compId}/rubric`,
      label: 'Rubric Configuration',
      owner: 'Yousef',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      to: '/judge/dashboard',
      label: 'Judge Dashboard',
      owner: 'Omar Mustafa',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      to: '/judge/evaluate/team-003',
      label: 'Evaluation Scoring',
      owner: 'Lubna / Omar',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
        </svg>
      ),
    },
    {
      to: `/admin/competitions/${compId}/rankings`,
      label: 'Rankings & Publication',
      owner: 'Adham',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      to: '/public/results',
      label: 'Public Results Podium',
      owner: 'Kermin',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-surface-950 text-surface-100 selection:bg-indigo-500 selection:text-white">
      {/* ───────────────── GLOBAL DEVELOPER NAVIGATION BAR (TOP OVERLAY) ───────────────── */}
      <DevNavbar />

      <div className="flex flex-1 relative">
        {/* ───────────────── LEFT SIDEBAR NAVIGATION ───────────────── */}
        <aside
          className={`
            fixed top-[49px] bottom-0 left-0 z-30
            transition-all duration-300 ease-in-out
            bg-surface-950/95 backdrop-blur-2xl
            border-r border-surface-800
            flex flex-col
            ${sidebarOpen ? 'w-64' : 'w-[72px]'}
          `.trim()}
        >
          {/* Logo / Branding */}
          <div className="p-4 flex items-center justify-between border-b border-surface-800/80">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-600/20 text-white font-extrabold text-xs">
                JF
              </div>
              {sidebarOpen && (
                <div className="animate-fade-in truncate">
                  <h1 className="text-xs font-black text-surface-100 tracking-tight">JudgeFlow</h1>
                  <p className="text-[9px] text-indigo-400 font-mono uppercase tracking-wider">
                    Official Admin Platform
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 rounded-lg text-surface-500 hover:text-white hover:bg-surface-800 transition-colors cursor-pointer"
              title={sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
            >
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${sidebarOpen ? '' : 'rotate-180'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
            {sidebarLinks.map((link) => {
              const isMatch = location.pathname === link.to;

              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                    text-xs font-medium transition-all duration-150
                    group
                    ${isMatch
                      ? link.isMyScope
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
                      : link.isMyScope
                      ? 'text-indigo-300 hover:bg-indigo-950/40 hover:text-white'
                      : 'text-surface-400 hover:bg-surface-850 hover:text-surface-100'
                    }
                  `.trim()}
                >
                  <span className="shrink-0">{link.icon}</span>

                  {sidebarOpen && (
                    <div className="flex-1 truncate text-left animate-fade-in flex items-center justify-between gap-1">
                      <span className="truncate">{link.label}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-mono shrink-0 ${
                          link.isMyScope
                            ? isMatch
                              ? 'bg-indigo-700 text-white font-bold'
                              : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold'
                            : isMatch
                            ? 'bg-primary-700 text-white'
                            : 'text-surface-500'
                        }`}
                      >
                        {link.isMyScope ? 'My Scope' : `[${link.owner}]`}
                      </span>
                    </div>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Sidebar Footer: Active Competition Widget */}
          {sidebarOpen && (
            <div className="p-3 border-t border-surface-800/80 bg-surface-950/80 text-[11px] animate-fade-in">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider block mb-1">
                Active Session
              </span>
              <p className="font-semibold text-surface-200 truncate">
                {currentCompetition?.name || 'Competition'}
              </p>
              <div className="flex items-center justify-between text-surface-500 mt-1 font-mono text-[10px]">
                <span>{compId}</span>
                <span className="text-emerald-400 font-semibold">
                  {activeTeam ? `Team: ${activeTeam.id}` : 'No active team'}
                </span>
              </div>
            </div>
          )}
        </aside>

        {/* ───────────────── MAIN APP CONTENT CANVAS ───────────────── */}
        <main
          className={`
            flex-1 transition-all duration-300 p-4 sm:p-6 lg:p-8
            ${sidebarOpen ? 'ml-64' : 'ml-[72px]'}
          `.trim()}
        >
          <Routes>
            {/* Overview Hub */}
            <Route path="/" element={<DeveloperOverviewPage />} />

            {/* Feature 3 — Admin Competition & Judging Setup [Mostafa khaled] */}
            <Route path="/admin/competitions/new" element={<AdminCompetitionNewPage />} />
            <Route path="/admin/competitions/:id/active-control" element={<AdminActiveControlPage />} />
            <Route path="/admin/competitions/:id/edit" element={<AdminCompetitionEditPage />} />
            <Route path="/admin/competitions/:id/rubric" element={<RubricConfigPage />} />

            {/* Module 1: Auth & Roles */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/role-navigation" element={<RoleNavigationPage />} />

            {/* Module 2: Participant & Teams */}
            <Route path="/register/participant" element={<ParticipantRegisterPage />} />
            <Route path="/admin/participants" element={<AdminParticipantsPage />} />
            <Route path="/admin/teams" element={<AdminTeamsPage />} />

            {/* Module 4: Judge Dashboard & Scoring */}
            <Route path="/judge/dashboard" element={<JudgeDashboardPage />} />
            <Route path="/judge/evaluate/:teamId" element={<JudgeEvaluatePage />} />
            <Route path="/judge/validation" element={<JudgeValidationPage />} />

            {/* Module 5: Results & Publication */}
            <Route path="/admin/competitions/:id/rankings" element={<AdminRankingsPage />} />
            <Route path="/public/results" element={<PublicResultsPage />} />
            <Route path="/admin/competitions/:id/tie-break" element={<TieResolutionPage />} />

            {/* Fallback */}
            <Route path="*" element={<DeveloperOverviewPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <PlatformProvider>
        <AppLayout />
      </PlatformProvider>
    </BrowserRouter>
  );
}
