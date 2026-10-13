import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlatform } from '../context/PlatformContext';
import { PLATFORM_ROUTES } from '../components/dev/DevNavbar';
import Button from '../components/ui/Button';

export default function DeveloperOverviewPage() {
  const {
    competitions,
    teams,
    selectedCompetitionId,
    currentCompetition,
    activeTeam,
  } = usePlatform();

  const navigate = useNavigate();

  const resolvePath = (path) => {
    return path.replace(':id', selectedCompetitionId || 'comp-002');
  };

  const totalCompetitions = competitions.length;
  const totalTeams = teams.length;
  const skippedTeamsCount = teams.filter((t) => t.workflowStatus === 'SKIPPED').length;
  const evaluatedTeamsCount = teams.filter((t) => t.evaluationStatus === 'EVALUATED').length;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* ───────────────── HERO HEADER ───────────────── */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-surface-900/90 to-surface-950 border border-indigo-500/30 backdrop-blur-2xl shadow-2xl animate-fade-in-up relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
            <span>Platform Technical Architecture & Developer Hub</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-surface-100 tracking-tight leading-tight">
            Competition Judging Platform Prototype
          </h1>

          <p className="text-sm sm:text-base text-surface-300 leading-relaxed">
            Welcome to the centralized architectural dashboard. Explore all 5 platform modules, team assignee
            responsibilities, and test the production-grade implementation of{' '}
            <strong className="text-indigo-300">Feature 3: Admin Competition and Judging Setup</strong> owned by{' '}
            <strong className="text-indigo-300">[Mostafa khaled]</strong>.
          </p>

          {/* Quick Action buttons */}
          <div className="pt-2 flex flex-wrap gap-3">
            <Button
              variant="primary"
              onClick={() => navigate('/admin/competitions/new')}
              id="hero-create-comp-btn"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              + Create Competition (Task 1)
            </Button>

            <Button
              variant="secondary"
              onClick={() => navigate(`/admin/competitions/${selectedCompetitionId}/active-control`)}
              id="hero-active-control-btn"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Active-Team Controls (Task 2)
            </Button>
          </div>
        </div>
      </div>

      {/* ───────────────── LIVE PLATFORM TELEMETRY STATS ───────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <div className="glass-card p-5 border border-surface-800">
          <span className="text-xs text-surface-400 uppercase tracking-wider block">Competitions</span>
          <span className="text-2xl font-black text-surface-100 font-mono mt-1 block">
            {totalCompetitions}
          </span>
          <span className="text-[11px] text-surface-500 mt-1 block">Real-time mock state</span>
        </div>

        <div className="glass-card p-5 border border-surface-800">
          <span className="text-xs text-surface-400 uppercase tracking-wider block">Total Teams</span>
          <span className="text-2xl font-black text-surface-100 font-mono mt-1 block">
            {totalTeams}
          </span>
          <span className="text-[11px] text-surface-500 mt-1 block">Allocated slots</span>
        </div>

        <div className="glass-card p-5 border border-surface-800">
          <span className="text-xs text-surface-400 uppercase tracking-wider block">Active Team</span>
          <span className="text-sm font-bold text-emerald-400 font-mono mt-2 block truncate">
            {activeTeam ? activeTeam.name : 'None selected'}
          </span>
          <span className="text-[11px] text-surface-500 mt-1 block">In judging chamber</span>
        </div>

        <div className="glass-card p-5 border border-surface-800">
          <span className="text-xs text-surface-400 uppercase tracking-wider block">Skipped Teams</span>
          <span className="text-2xl font-black text-amber-400 font-mono mt-1 block">
            {skippedTeamsCount}
          </span>
          <span className="text-[11px] text-amber-500/80 mt-1 block">NOT_EVALUATED (Can Revisit)</span>
        </div>
      </div>

      {/* ───────────────── PRIMARY FEATURE 3 SPOTLIGHT [Mostafa khaled] ───────────────── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-indigo-950/20 border border-indigo-500/40 shadow-xl space-y-5 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-indigo-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-300 font-black text-lg">
              ★
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-surface-100">
                  Feature 3 — Admin Competition and Judging Setup
                </h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-500 text-white uppercase">
                  My Assigned Scope
                </span>
              </div>
              <p className="text-xs text-surface-400 mt-0.5">
                Owner: <strong className="text-indigo-300">[Mostafa khaled]</strong> • Built strictly to canonical Technical Architecture specs
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Task 1 Card */}
          <div
            onClick={() => navigate('/admin/competitions/new')}
            className="p-5 rounded-2xl bg-surface-900/80 border border-indigo-500/30 hover:border-indigo-400 transition-all cursor-pointer group shadow-sm hover:shadow-indigo-950/50"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono text-indigo-300 font-bold bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/30">
                Task 1: Competition Setup
              </span>
              <span className="text-xs text-surface-500 font-mono">POST /api/v1/competitions</span>
            </div>
            <h3 className="text-base font-bold text-surface-100 group-hover:text-indigo-300 transition-colors">
              Competition Creation and Configuration Screens
            </h3>
            <p className="text-xs text-surface-400 mt-1.5 leading-relaxed">
              Form inputs with required name and optional description. Handles HTTP 201 Created envelope with status "DRAFT" and resultsStatus "UNPUBLISHED". Includes update form via PATCH and details viewer via GET.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-indigo-400 gap-1.5">
              <span>Open Task 1 Form</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>

          {/* Task 2 Card */}
          <div
            onClick={() => navigate(`/admin/competitions/${selectedCompetitionId}/active-control`)}
            className="p-5 rounded-2xl bg-surface-900/80 border border-indigo-500/30 hover:border-indigo-400 transition-all cursor-pointer group shadow-sm hover:shadow-indigo-950/50"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono text-indigo-300 font-bold bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/30">
                Task 2: Live Judging Controls
              </span>
              <span className="text-xs text-surface-500 font-mono">PATCH /active-team & POST /skip</span>
            </div>
            <h3 className="text-base font-bold text-surface-100 group-hover:text-indigo-300 transition-colors">
              Active-Team Controls, Skip & Revisit Interactions
            </h3>
            <p className="text-xs text-surface-400 mt-1.5 leading-relaxed">
              Live admin control panel to set or switch currently active team. Skip action modal strictly sets workflowStatus to "SKIPPED" and evaluationStatus to "NOT_EVALUATED" without assigning zero score. Revisit interaction allows returning to skipped teams.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-indigo-400 gap-1.5">
              <span>Open Task 2 Controls</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        </div>
      </div>

      {/* ───────────────── FULL PLATFORM SITEMAP & ALL TEAM ASSIGNMENTS ───────────────── */}
      <div className="space-y-5 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-surface-100">
              Complete Cross-Platform Architecture Sitemap
            </h2>
            <p className="text-xs text-surface-400 mt-0.5">
              Interactive directory of all routes across the 5 canonical modules with assigned developers.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {PLATFORM_ROUTES.map((module) => (
            <div
              key={module.moduleNumber}
              className={`p-6 rounded-3xl border ${
                module.isMyScope
                  ? 'bg-indigo-950/15 border-indigo-500/40'
                  : 'glass-card border-surface-800'
              }`}
            >
              {/* Module Header */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-surface-800/80">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl bg-surface-800 text-primary-400 text-xs font-bold flex items-center justify-center">
                    {module.moduleNumber}
                  </span>
                  <h3 className="text-base font-bold text-surface-100">
                    {module.moduleTitle}
                  </h3>
                </div>
                {module.isMyScope && (
                  <span className="px-2.5 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider">
                    My Scope
                  </span>
                )}
              </div>

              {/* Module Routes Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {module.routes.map((routeItem) => {
                  const actualPath = resolvePath(routeItem.path);
                  const isMyTask = routeItem.owner === 'Mostafa khaled';

                  return (
                    <div
                      key={routeItem.path}
                      onClick={() => navigate(actualPath)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer group ${
                        isMyTask
                          ? 'bg-indigo-900/20 border-indigo-500/40 hover:border-indigo-400 hover:bg-indigo-900/40'
                          : 'bg-surface-900/60 border-surface-800 hover:border-surface-600 hover:bg-surface-800/60'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            isMyTask
                              ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/40'
                              : 'bg-surface-800 text-surface-300 border border-surface-700'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isMyTask ? 'bg-indigo-400' : 'bg-surface-400'}`} />
                          [{routeItem.owner}]
                        </span>

                        {routeItem.apiMethod && (
                          <span className="text-[10px] font-mono text-primary-400 font-semibold truncate">
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
      </div>
    </div>
  );
}
