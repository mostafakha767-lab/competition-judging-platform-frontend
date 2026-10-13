import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePlatform } from '../context/PlatformContext';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import StatusBadge from '../components/ui/StatusBadge';

// ─── 1. ADMIN RANKINGS REVIEW & PUBLICATION [Adham] ───────────────────────────
export function AdminRankingsPage() {
  const { id } = useParams();
  const { selectedCompetitionId, currentTeams, currentCompetition } = usePlatform();
  const compId = id || selectedCompetitionId || 'comp-002';

  const [isPublished, setIsPublished] = useState(currentCompetition?.resultsStatus === 'PUBLISHED');

  // Sort evaluated teams by score descending
  const rankedTeams = [...currentTeams]
    .filter((t) => t.evaluationStatus === 'EVALUATED')
    .sort((a, b) => (b.score || 0) - (a.score || 0));

  const unEvaluatedTeams = [...currentTeams].filter((t) => t.evaluationStatus !== 'EVALUATED');

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <PageHeader
        owner="Adham"
        featureModule="Module 5: Results & Publication"
        title="Admin Rankings Review & Publication"
        description="Review aggregate scores across all evaluation panels, audit leaderboards, resolve anomalies, and publish official results to public viewers."
        route={`/admin/competitions/${compId}/rankings`}
      >
        <Button
          variant={isPublished ? 'secondary' : 'success'}
          size="sm"
          onClick={() => setIsPublished(!isPublished)}
        >
          {isPublished ? 'Unpublish Results' : 'Publish Official Results'}
        </Button>
      </PageHeader>

      <div className="glass-card p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-surface-100">
              Final Official Standings ({currentCompetition?.name})
            </h3>
            <p className="text-xs text-surface-400 mt-0.5">
              Rankings compiled from verified judge evaluations.
            </p>
          </div>
          <StatusBadge status={isPublished ? 'PUBLISHED' : 'UNPUBLISHED'} />
        </div>

        {/* Ranked Teams Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-surface-950/70 text-surface-400 uppercase tracking-wider">
              <tr>
                <th className="p-3 rounded-l-xl">Rank</th>
                <th className="p-3">Team Name</th>
                <th className="p-3">Project Title</th>
                <th className="p-3">Track</th>
                <th className="p-3 text-right">Aggregate Score</th>
                <th className="p-3 text-right rounded-r-xl">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-800">
              {rankedTeams.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-surface-500">
                    No teams evaluated yet. Use Judge Evaluation screens to submit scores.
                  </td>
                </tr>
              ) : (
                rankedTeams.map((t, idx) => (
                  <tr key={t.id} className="hover:bg-surface-800/30">
                    <td className="p-3 font-bold font-mono text-sm text-primary-300">
                      #{idx + 1}
                    </td>
                    <td className="p-3 font-semibold text-surface-100">{t.name}</td>
                    <td className="p-3 text-surface-400">{t.projectTitle}</td>
                    <td className="p-3 text-surface-300">{t.category || 'General'}</td>
                    <td className="p-3 font-mono font-bold text-emerald-400 text-right text-sm">
                      {t.score ? t.score.toFixed(1) : '—'} / 100
                    </td>
                    <td className="p-3 text-right">
                      <StatusBadge status={t.workflowStatus} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Skipped / Un-evaluated Teams Reminder */}
        {unEvaluatedTeams.length > 0 && (
          <div className="p-4 bg-surface-950/60 rounded-xl border border-surface-800 text-xs">
            <h4 className="font-bold text-surface-300 mb-2">
              Teams Not Evaluated in this Competition ({unEvaluatedTeams.length}):
            </h4>
            <div className="flex flex-wrap gap-2">
              {unEvaluatedTeams.map((t) => (
                <span
                  key={t.id}
                  className="px-2.5 py-1 rounded-lg bg-surface-900 border border-surface-800 text-surface-400 font-mono text-[11px] flex items-center gap-1.5"
                >
                  <span>{t.name}</span>
                  <StatusBadge status={t.workflowStatus} />
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── 2. PUBLIC VIEWER COMPETITION RESULTS & TOP 10 [Kermin] ───────────────────
export function PublicResultsPage() {
  const { currentTeams, currentCompetition } = usePlatform();

  const topTeams = [...currentTeams]
    .filter((t) => t.evaluationStatus === 'EVALUATED')
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 10);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <PageHeader
        owner="Kermin"
        featureModule="Module 5: Results & Publication"
        title="Public Viewer Results & Top 10 Leaderboard"
        description="Public-facing celebratory display showcasing competition podium winners and top 10 ranked teams."
        route="/public/results"
      />

      {/* Podium Display (Top 3) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Second Place */}
        <div className="p-6 rounded-3xl bg-surface-900/60 border border-surface-700/60 backdrop-blur-xl text-center space-y-3 md:order-1 order-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-700/80 flex items-center justify-center font-bold text-lg text-slate-200">
            2
          </div>
          <span className="text-xs uppercase tracking-widest text-slate-400 font-bold block">
            Silver Medal
          </span>
          <h3 className="text-lg font-bold text-surface-100">
            {topTeams[1]?.name || 'Quantum Coders'}
          </h3>
          <p className="text-xs text-surface-400">
            {topTeams[1]?.projectTitle || 'Autonomous Computing'}
          </p>
          <span className="text-xl font-mono font-extrabold text-slate-300 block">
            {topTeams[1]?.score || 91.2} pts
          </span>
        </div>

        {/* First Place */}
        <div className="p-8 rounded-3xl bg-gradient-to-b from-amber-500/20 via-surface-900/80 to-surface-900 border border-amber-500/40 backdrop-blur-xl text-center space-y-3 md:order-2 order-1 shadow-2xl shadow-amber-500/10 scale-105">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/30 border border-amber-400/50 flex items-center justify-center font-black text-2xl text-amber-300">
            👑 1
          </div>
          <span className="text-xs uppercase tracking-widest text-amber-400 font-extrabold block">
            Grand Champion
          </span>
          <h3 className="text-2xl font-black text-surface-100">
            {topTeams[0]?.name || 'RoboForge'}
          </h3>
          <p className="text-xs text-surface-300">
            {topTeams[0]?.projectTitle || 'Modular Bionic Prosthetics'}
          </p>
          <span className="text-3xl font-mono font-black text-amber-300 block">
            {topTeams[0]?.score || 94.8} pts
          </span>
        </div>

        {/* Third Place */}
        <div className="p-6 rounded-3xl bg-surface-900/60 border border-surface-700/60 backdrop-blur-xl text-center space-y-3 md:order-3 order-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-amber-800/60 flex items-center justify-center font-bold text-lg text-amber-400">
            3
          </div>
          <span className="text-xs uppercase tracking-widest text-amber-600 font-bold block">
            Bronze Medal
          </span>
          <h3 className="text-lg font-bold text-surface-100">
            {topTeams[2]?.name || 'Neural Nexus'}
          </h3>
          <p className="text-xs text-surface-400">
            {topTeams[2]?.projectTitle || 'Vision Guidance System'}
          </p>
          <span className="text-xl font-mono font-extrabold text-amber-500 block">
            {topTeams[2]?.score || 88.5} pts
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── 3. TIE RESOLUTION & TIE-BREAK STAGE SCREENS [Adham] ───────────────────────
export function TieResolutionPage() {
  const { id } = useParams();
  const { selectedCompetitionId } = usePlatform();
  const compId = id || selectedCompetitionId || 'comp-002';

  const [resolved, setResolved] = useState(false);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <PageHeader
        owner="Adham"
        featureModule="Module 5: Results & Publication"
        title="Tie Resolution & Tie-Break Stages"
        description="Deterministic tie-breaker engine comparing primary criterion weights, head-to-head judge rankings, or triggering lightning defense rounds."
        route={`/admin/competitions/${compId}/tie-break`}
      />

      <div className="glass-card p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-surface-800">
          <div>
            <h3 className="text-base font-bold text-surface-100">Tie-Break State Detector</h3>
            <p className="text-xs text-surface-400 mt-0.5">
              Automated audit for identical aggregate scores across competition podium finalists.
            </p>
          </div>
          <Button
            variant={resolved ? 'secondary' : 'primary'}
            size="sm"
            onClick={() => setResolved(!resolved)}
          >
            {resolved ? 'Reset Scenario' : 'Resolve Tie Deterministically'}
          </Button>
        </div>

        {resolved && (
          <Alert
            type="success"
            title="Tie Resolved via Primary Criterion Rule"
            message="Team A wins tie-break based on higher score in Criterion 1 (Technical Complexity: 34.5 vs 33.0)."
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-surface-900 rounded-xl border border-surface-800 space-y-2">
            <h4 className="font-bold text-surface-200">Tier 1: Technical Weight Priority</h4>
            <p className="text-surface-400">
              If two teams hold identical composite scores, the team with higher points in the highest weighted rubric criterion takes precedence.
            </p>
          </div>
          <div className="p-4 bg-surface-900 rounded-xl border border-surface-800 space-y-2">
            <h4 className="font-bold text-surface-200">Tier 2: Lightning Re-evaluation</h4>
            <p className="text-surface-400">
              Admin can trigger a 3-minute lightning pitch with the Lead Judge panel to submit a decisive head-to-head delta score.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
