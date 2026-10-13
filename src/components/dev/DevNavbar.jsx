import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { usePlatform } from '../../context/PlatformContext';

export const PLATFORM_ROUTES = [
  {
    moduleNumber: 1,
    moduleTitle: 'Authentication & Role Navigation',
    routes: [
      {
        path: '/login',
        name: 'Login Screen',
        owner: 'Hala',
        description: 'Authentication entry, credentials input & token retrieval',
      },
      {
        path: '/register',
        name: 'Admin / Judge Register',
        owner: 'Hala',
        description: 'Role-based account registration & validation',
      },
      {
        path: '/role-navigation',
        name: 'Role-Based Protected Routes & State',
        owner: 'Abdallah',
        description: 'Route guards, role permissions (Admin, Judge, Participant), & logout state',
      },
    ],
  },
  {
    moduleNumber: 2,
    moduleTitle: 'Participant & Team Management',
    routes: [
      {
        path: '/register/participant',
        name: 'Participant Registration Form',
        owner: 'Abdallah',
        description: 'Self-service registration form for hackathon student participants',
      },
      {
        path: '/admin/participants',
        name: 'Review & Filter Participants',
        owner: 'Yousef',
        description: 'Admin participant table with search, status filters & verification',
      },
      {
        path: '/admin/teams',
        name: 'Team Creation & Assignment',
        owner: 'Yousef',
        description: 'Build teams, assign members, and allocate to competitions',
      },
    ],
  },
  {
    moduleNumber: 3,
    moduleTitle: 'Feature 3 — Admin Competition & Judging Setup',
    isMyScope: true,
    routes: [
      {
        path: '/admin/competitions/new',
        name: 'Create & Config Competition',
        owner: 'Mostafa khaled',
        isMyScope: true,
        apiMethod: 'POST /api/v1/competitions',
        description: 'Form with name & description; HTTP 201 response envelope handling',
      },
      {
        path: '/admin/competitions/:id/active-control',
        name: 'Active-Team Controls, Skip & Revisit',
        owner: 'Mostafa khaled',
        isMyScope: true,
        apiMethod: 'PATCH /active-team & POST /skip',
        description: 'Live active team selector, domain-rule skip modal, and revisit interactions',
      },
      {
        path: '/admin/competitions/:id/edit',
        name: 'Update Competition Details Form',
        owner: 'Mostafa khaled',
        isMyScope: true,
        apiMethod: 'PATCH /api/v1/competitions/:id',
        description: 'Editable details with dirty checking and GET details viewer',
      },
      {
        path: '/admin/competitions/:id/rubric',
        name: 'Judge Assignment & Rubric Configuration',
        owner: 'Yousef',
        description: 'Rubric criteria weights, scoring scales, and judge panel assignment',
      },
    ],
  },
  {
    moduleNumber: 4,
    moduleTitle: 'Judge Dashboard & Evaluation',
    routes: [
      {
        path: '/judge/dashboard',
        name: 'Judge Dashboard & Assigned Teams',
        owner: 'Omar Mustafa',
        description: 'Live judging queue, presentation schedule, and assigned team status',
      },
      {
        path: '/judge/evaluate/team-003',
        name: 'Evaluation Form & Criteria Weights',
        owner: 'Lubna / Omar Mustafa',
        description: 'Interactive rubric scoring sliders with criteria weights & live sum',
      },
      {
        path: '/judge/validation',
        name: 'Evaluation Validation & Edit States',
        owner: 'Lubna',
        description: 'Score boundary validation, confirmation modal, and post-submission review',
      },
    ],
  },
  {
    moduleNumber: 5,
    moduleTitle: 'Results & Publication',
    routes: [
      {
        path: '/admin/competitions/:id/rankings',
        name: 'Admin Rankings Review & Publication',
        owner: 'Adham',
        description: 'Weighted aggregate scores, final leaderboards, and publish toggle',
      },
      {
        path: '/public/results',
        name: 'Public Viewer Results & Top 10',
        owner: 'Kermin',
        description: 'Public-facing celebratory leaderboard with top 10 finalists display',
      },
      {
        path: '/admin/competitions/:id/tie-break',
        name: 'Tie Resolution & Tie-Break Stages',
        owner: 'Adham',
        description: 'Multi-criteria tie resolution rules and tie-break stage management',
      },
    ],
  },
];

export default function DevNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOwnerFilter, setSelectedOwnerFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showApiLog, setShowApiLog] = useState(false);

  const {
    competitions,
    selectedCompetitionId,
    setSelectedCompetitionId,
    currentCompetition,
    activeTeam,
    apiActivityLog,
  } = usePlatform();

  const navigate = useNavigate();
  const location = useLocation();

  // Replace :id with actual current competition ID
  const resolvePath = (path) => {
    return path.replace(':id', selectedCompetitionId || 'comp-002');
  };

  const allOwners = [
    'ALL',
    'Mostafa khaled',
    'Hala',
    'Abdallah',
    'Yousef',
    'Omar Mustafa',
    'Lubna',
    'Adham',
    'Kermin',
  ];

  const filteredModules = PLATFORM_ROUTES.map((mod) => {
    const matchingRoutes = mod.routes.filter((r) => {
      const matchesOwner =
        selectedOwnerFilter === 'ALL' ||
        r.owner.toLowerCase().includes(selectedOwnerFilter.toLowerCase());
      const matchesSearch =
        searchQuery === '' ||
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.owner.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesOwner && matchesSearch;
    });
    return { ...mod, routes: matchingRoutes };
  }).filter((mod) => mod.routes.length > 0);

  return (
    <>
      {/* ───────────────── TOP DEVELOPER OVERVIEW BAR ───────────────── */}
      <header className="sticky top-0 z-40 bg-surface-950/90 backdrop-blur-xl border-b border-surface-800 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          {/* Brand & Sitemap Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary-600/20 hover:bg-primary-600/30 border border-primary-500/30 text-primary-300 text-xs font-semibold tracking-wide transition-all cursor-pointer shadow-sm"
              title="Toggle Full Team Sitemap Overlay"
            >
              <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              <span>Dev Sitemap ({isOpen ? 'Close' : 'Open'})</span>
            </button>

            {/* Quick Home / Dashboard link */}
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors ${
                  isActive
                    ? 'text-white bg-surface-800'
                    : 'text-surface-400 hover:text-surface-200'
                }`
              }
            >
              Overview Hub
            </NavLink>
          </div>

          {/* Quick Scope Shortcuts (Direct links to Mostafa's assigned features) */}
          <div className="hidden lg:flex items-center gap-2 bg-surface-900/80 px-3 py-1 rounded-xl border border-indigo-500/30">
            <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
              [Mostafa khaled] Scope:
            </span>
            <button
              onClick={() => navigate('/admin/competitions/new')}
              className={`text-xs px-2 py-0.5 rounded transition-all cursor-pointer ${
                location.pathname === '/admin/competitions/new'
                  ? 'bg-indigo-600 text-white font-medium shadow-sm'
                  : 'text-surface-300 hover:text-white hover:bg-surface-800'
              }`}
            >
              + Create Comp
            </button>
            <span className="text-surface-600">|</span>
            <button
              onClick={() => navigate(`/admin/competitions/${selectedCompetitionId}/active-control`)}
              className={`text-xs px-2 py-0.5 rounded transition-all cursor-pointer ${
                location.pathname.includes('/active-control')
                  ? 'bg-indigo-600 text-white font-medium shadow-sm'
                  : 'text-surface-300 hover:text-white hover:bg-surface-800'
              }`}
            >
              Active-Team Controls
            </button>
            <span className="text-surface-600">|</span>
            <button
              onClick={() => navigate(`/admin/competitions/${selectedCompetitionId}/edit`)}
              className={`text-xs px-2 py-0.5 rounded transition-all cursor-pointer ${
                location.pathname.includes('/edit')
                  ? 'bg-indigo-600 text-white font-medium shadow-sm'
                  : 'text-surface-300 hover:text-white hover:bg-surface-800'
              }`}
            >
              Edit Comp
            </button>
          </div>

          {/* Right Status Controls: Competition Switcher & Live Active Team */}
          <div className="flex items-center gap-2.5">
            {/* Global Competition Switcher */}
            <div className="flex items-center gap-1.5 bg-surface-900 px-2 py-1 rounded-lg border border-surface-800 text-xs">
              <span className="text-surface-400 text-[11px] hidden sm:inline">Comp:</span>
              <select
                value={selectedCompetitionId}
                onChange={(e) => {
                  setSelectedCompetitionId(e.target.value);
                  // If currently on an ID-dependent route, navigate to the newly selected ID
                  if (location.pathname.includes('/admin/competitions/')) {
                    const subpath = location.pathname.split('/')[3] || 'active-control';
                    navigate(`/admin/competitions/${e.target.value}/${subpath}`);
                  }
                }}
                className="bg-transparent text-primary-300 font-semibold focus:outline-none cursor-pointer text-xs"
              >
                {competitions.map((c) => (
                  <option key={c.id} value={c.id} className="bg-surface-900 text-surface-200">
                    {c.id} ({c.name.substring(0, 16)}...)
                  </option>
                ))}
              </select>
            </div>

            {/* Live Active Team Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-900 border border-surface-800 text-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-surface-400 text-[11px]">Active:</span>
              <span className="text-surface-200 font-medium">
                {activeTeam ? activeTeam.name : 'None selected'}
              </span>
            </div>

            {/* Live API Activity Drawer Button */}
            <button
              onClick={() => setShowApiLog(!showApiLog)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-800/80 hover:bg-surface-700/80 border border-surface-700 text-xs text-surface-300 transition-colors cursor-pointer"
              title="Inspect API Envelopes"
            >
              <svg className="w-3.5 h-3.5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <span>API ({apiActivityLog.length})</span>
            </button>
          </div>
        </div>
      </header>

      {/* ───────────────── COLLAPSIBLE FULL SITEMAP OVERLAY DRAWER ───────────────── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-surface-950/80 backdrop-blur-md flex flex-col animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-6xl mx-auto my-auto max-h-[92vh] bg-surface-900 border border-surface-700/70 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-surface-800 flex items-center justify-between gap-4 bg-surface-950/50">
              <div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-600/20 rounded-xl">
                    <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-surface-100">
                      Competition Judging Platform — Global Developer Map
                    </h2>
                    <p className="text-xs text-surface-400 mt-0.5">
                      Canonical Technical Architecture mapping all 5 modules and team ownerships
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-surface-400 hover:text-white bg-surface-800 rounded-xl hover:bg-surface-700 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Filter and Search Controls */}
            <div className="px-6 py-3.5 bg-surface-900/90 border-b border-surface-800 flex flex-wrap items-center justify-between gap-3">
              {/* Filter by Owner */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs text-surface-400 font-medium mr-1">Filter by Assignee:</span>
                {allOwners.map((owner) => {
                  const isSelected = selectedOwnerFilter === owner;
                  const isMostafa = owner === 'Mostafa khaled';
                  return (
                    <button
                      key={owner}
                      onClick={() => setSelectedOwnerFilter(owner)}
                      className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                        isSelected
                          ? isMostafa
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                            : 'bg-primary-600 text-white'
                          : isMostafa
                          ? 'bg-indigo-950/40 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-900/50'
                          : 'bg-surface-800 text-surface-400 hover:text-surface-200 hover:bg-surface-700'
                      }`}
                    >
                      {isMostafa ? `★ ${owner} (My Scope)` : owner}
                    </button>
                  );
                })}
              </div>

              {/* Search input */}
              <div className="relative min-w-[240px]">
                <input
                  type="text"
                  placeholder="Search routes or features..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-surface-950/60 border border-surface-700 rounded-xl text-xs text-surface-200 placeholder-surface-500 focus:outline-none focus:border-primary-500"
                />
                <svg
                  className="w-3.5 h-3.5 text-surface-500 absolute left-2.5 top-2.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Sitemap Grid Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {filteredModules.map((module) => (
                <div
                  key={module.moduleNumber}
                  className={`p-5 rounded-2xl border transition-all ${
                    module.isMyScope
                      ? 'bg-indigo-950/20 border-indigo-500/40 shadow-lg shadow-indigo-900/10'
                      : 'bg-surface-950/40 border-surface-800'
                  }`}
                >
                  {/* Module Title & Badge */}
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-surface-800/80">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-surface-800 text-primary-400 text-xs font-bold flex items-center justify-center">
                        {module.moduleNumber}
                      </span>
                      <h3 className="text-sm font-bold text-surface-100">
                        {module.moduleTitle}
                      </h3>
                      {module.isMyScope && (
                        <span className="px-2 py-0.5 rounded bg-indigo-600 text-white text-[10px] uppercase font-bold tracking-wider">
                          Assigned Scope (Feature 3)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Routes Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {module.routes.map((routeItem) => {
                      const actualPath = resolvePath(routeItem.path);
                      const isCurrent = location.pathname === actualPath;
                      const isMyTask = routeItem.owner === 'Mostafa khaled';

                      return (
                        <div
                          key={routeItem.path}
                          onClick={() => {
                            navigate(actualPath);
                            setIsOpen(false);
                          }}
                          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer group ${
                            isCurrent
                              ? 'bg-primary-600/20 border-primary-500 shadow-md shadow-primary-500/10'
                              : isMyTask
                              ? 'bg-indigo-900/15 border-indigo-500/30 hover:border-indigo-400 hover:bg-indigo-900/30'
                              : 'bg-surface-900/60 border-surface-800 hover:border-surface-600 hover:bg-surface-800/60'
                          }`}
                        >
                          {/* Owner badge and tag */}
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold ${
                                isMyTask
                                  ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/40'
                                  : 'bg-surface-800 text-surface-300 border border-surface-700'
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${isMyTask ? 'bg-indigo-400' : 'bg-surface-400'}`} />
                              [{routeItem.owner}]
                            </span>
                            {routeItem.apiMethod && (
                              <span className="text-[10px] font-mono text-primary-400 font-semibold">
                                {routeItem.apiMethod}
                              </span>
                            )}
                          </div>

                          <h4 className="text-xs font-bold text-surface-100 group-hover:text-primary-300 transition-colors">
                            {routeItem.name}
                          </h4>

                          <p className="text-[11px] font-mono text-surface-400 mt-1 truncate">
                            {actualPath}
                          </p>

                          <p className="text-[11px] text-surface-500 mt-1.5 line-clamp-2 leading-relaxed">
                            {routeItem.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-surface-800 bg-surface-950/60 flex items-center justify-between text-xs text-surface-400">
              <span>Click any card to jump immediately to that component/page view.</span>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 bg-surface-800 hover:bg-surface-700 text-surface-200 rounded-xl transition-colors cursor-pointer"
              >
                Close Sitemap
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────── LIVE API ACTIVITY INSPECTOR DRAWER ───────────────── */}
      {showApiLog && (
        <div className="fixed bottom-0 right-0 z-50 w-full md:w-[480px] max-h-[420px] bg-surface-900 border-t md:border-l border-surface-700 rounded-t-2xl md:rounded-tl-2xl shadow-2xl flex flex-col animate-slide-down">
          <div className="p-3.5 border-b border-surface-800 flex items-center justify-between bg-surface-950/70">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h4 className="text-xs font-bold text-surface-100 uppercase tracking-wider">
                API Envelope Activity ({apiActivityLog.length})
              </h4>
            </div>
            <button
              onClick={() => setShowApiLog(false)}
              className="text-surface-400 hover:text-surface-200 text-xs px-2 py-1 rounded bg-surface-800 cursor-pointer"
            >
              Close
            </button>
          </div>

          <div className="p-3 overflow-y-auto space-y-2.5 flex-1 text-xs">
            {apiActivityLog.length === 0 ? (
              <p className="text-center py-8 text-surface-500 text-xs">
                No API calls triggered yet. Use "Create Competition" or "Set Active Team" to see live envelope payloads.
              </p>
            ) : (
              apiActivityLog.map((log) => (
                <div key={log.id} className="p-2.5 rounded-xl bg-surface-950/80 border border-surface-800">
                  <div className="flex items-center justify-between font-mono text-[11px] mb-1">
                    <span className="font-bold text-primary-400">
                      {log.method} {log.url}
                    </span>
                    <span className="text-surface-500 text-[10px]">{log.timestamp}</span>
                  </div>
                  {log.requestBody && Object.keys(log.requestBody).length > 0 && (
                    <div className="mt-1">
                      <span className="text-[10px] text-surface-500 uppercase">Request Body:</span>
                      <pre className="text-[10px] text-surface-300 bg-surface-900 p-1.5 rounded overflow-x-auto mt-0.5">
                        {JSON.stringify(log.requestBody, null, 2)}
                      </pre>
                    </div>
                  )}
                  <div className="mt-1">
                    <span className="text-[10px] text-emerald-400 uppercase font-semibold">Response Envelope:</span>
                    <pre className="text-[10px] text-emerald-300 bg-surface-900 p-1.5 rounded overflow-x-auto mt-0.5">
                      {JSON.stringify(log.responseEnvelope, null, 2)}
                    </pre>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}
