import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlatform } from '../context/PlatformContext';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import StatusBadge from '../components/ui/StatusBadge';

// ─── 1. JUDGE DASHBOARD & ASSIGNED TEAM LIST [Omar Mustafa] ────────────────────
export function JudgeDashboardPage() {
  const { currentTeams, activeTeam, currentCompetition } = usePlatform();
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <PageHeader
        owner="Omar Mustafa"
        featureModule="Module 4: Judge Dashboard & Evaluation"
        title="Judge Live Queue & Assigned Teams"
        description="Live dashboard for judges to view the active presenting team set by the Admin, review assigned criteria, and access the evaluation scoring form."
        route="/judge/dashboard"
      />

      {/* Active Team Live Banner for Judge */}
      {activeTeam ? (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-surface-900 to-surface-900 border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-cyan-400 font-bold uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Now Presenting in Judging Chamber</span>
            </div>
            <h3 className="text-xl font-extrabold text-surface-100">{activeTeam.name}</h3>
            <p className="text-xs text-surface-400 mt-0.5">{activeTeam.projectTitle}</p>
          </div>
          <Button
            variant="primary"
            onClick={() => navigate(`/judge/evaluate/${activeTeam.id}`)}
          >
            Launch Evaluation Form →
          </Button>
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-surface-900 border border-surface-800 text-center text-xs text-surface-400">
          Waiting for Admin ([Mostafa khaled]) to designate the next active team in the live session controls.
        </div>
      )}

      {/* Assigned Teams Table */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-base font-bold text-surface-100">
          Evaluation Schedule ({currentCompetition?.name})
        </h3>

        <div className="space-y-3">
          {currentTeams.map((t) => (
            <div
              key={t.id}
              className="p-4 bg-surface-900/60 rounded-xl border border-surface-800 flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-surface-200">{t.name}</h4>
                  <StatusBadge status={t.workflowStatus} />
                  <StatusBadge status={t.evaluationStatus} />
                </div>
                <p className="text-xs text-surface-400 mt-1">{t.projectTitle}</p>
              </div>

              <Button
                variant={t.evaluationStatus === 'EVALUATED' ? 'secondary' : 'primary'}
                size="sm"
                onClick={() => navigate(`/judge/evaluate/${t.id}`)}
              >
                {t.evaluationStatus === 'EVALUATED' ? 'Review Score' : 'Score Team'}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 2. EVALUATION FORM WITH CRITERIA & WEIGHTS [Lubna / Omar Mustafa] ────────
export function JudgeEvaluatePage() {
  const { teamId } = useParams();
  const { currentTeams } = usePlatform();
  const navigate = useNavigate();

  const targetTeam = currentTeams.find((t) => t.id === teamId) || currentTeams[0];

  const [scores, setScores] = useState({
    tech: 85,
    innov: 90,
    impact: 88,
    defense: 92,
  });

  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Compute weighted sum
  const weightedScore = (
    scores.tech * 0.35 +
    scores.innov * 0.25 +
    scores.impact * 0.2 +
    scores.defense * 0.2
  ).toFixed(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <PageHeader
        owner="Lubna / Omar Mustafa"
        featureModule="Module 4: Judge Dashboard & Evaluation"
        title={`Evaluate Team: ${targetTeam?.name || teamId}`}
        description="Comprehensive scoring rubric with weighted criteria sliders, live aggregate calculation, and qualitative feedback."
        route={`/judge/evaluate/${teamId || 'team-003'}`}
      />

      <div className="glass-card p-6 sm:p-8 space-y-6">
        {submitted ? (
          <div className="space-y-4">
            <Alert
              type="success"
              title="Evaluation Submitted Successfully"
              message={`Final weighted score of ${weightedScore}/100 recorded for ${targetTeam?.name}. Submitted to Admin rankings.`}
            />
            <div className="flex gap-3">
              <Button variant="primary" onClick={() => navigate('/judge/dashboard')}>
                Return to Judge Queue
              </Button>
              <Button variant="secondary" onClick={() => navigate('/judge/validation')}>
                View Validation & Edit States
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Criteria scoring sliders */}
            <div className="space-y-5">
              {[
                { key: 'tech', label: 'Technical Complexity & Architecture', weight: '35%' },
                { key: 'innov', label: 'Innovation & Originality', weight: '25%' },
                { key: 'impact', label: 'Feasibility & Market Impact', weight: '20%' },
                { key: 'defense', label: 'Team Presentation & Q&A Defense', weight: '20%' },
              ].map((c) => (
                <div key={c.key} className="p-4 bg-surface-900 rounded-xl border border-surface-800 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-surface-200">
                      {c.label} <span className="text-primary-400 font-mono">(Weight: {c.weight})</span>
                    </span>
                    <span className="font-mono font-bold text-primary-300 text-sm">
                      {scores[c.key]} / 100
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={scores[c.key]}
                    onChange={(e) => setScores({ ...scores, [c.key]: Number(e.target.value) })}
                    className="w-full accent-primary-500 cursor-pointer"
                  />
                </div>
              ))}
            </div>

            {/* Total Weighted Score Banner */}
            <div className="p-4 rounded-xl bg-surface-950 border border-primary-500/30 flex items-center justify-between">
              <div>
                <span className="text-xs text-surface-400 uppercase tracking-wider block">
                  Weighted Aggregate Score
                </span>
                <span className="text-xs text-surface-500">Calculated in real-time per rubric formula</span>
              </div>
              <span className="text-2xl font-black font-mono text-primary-300">
                {weightedScore} <span className="text-sm font-normal text-surface-500">/ 100</span>
              </span>
            </div>

            <Button type="submit" variant="primary" className="w-full">
              Submit Final Evaluation
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── 3. EVALUATION VALIDATION & EDIT STATES [Lubna] ────────────────────────────
export function JudgeValidationPage() {
  const [isLocked, setIsLocked] = useState(false);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <PageHeader
        owner="Lubna"
        featureModule="Module 4: Judge Dashboard & Evaluation"
        title="Evaluation Validation & Edit States"
        description="Boundary checks, audit logs, and locked-state controls preventing score tampering after judging session closure."
        route="/judge/validation"
      />

      <div className="glass-card p-6 space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-surface-800">
          <div>
            <h3 className="text-base font-bold text-surface-100">Score Edit Locking Mechanism</h3>
            <p className="text-xs text-surface-400 mt-0.5">
              Simulate judge lock state when evaluation window closes.
            </p>
          </div>
          <Button
            variant={isLocked ? 'success' : 'danger'}
            size="sm"
            onClick={() => setIsLocked(!isLocked)}
          >
            {isLocked ? 'Unlock Evaluation Editing' : 'Lock Evaluation Scores'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-surface-900 rounded-xl border border-surface-800 space-y-2">
            <h4 className="font-bold text-surface-200">Validation Rule Engine</h4>
            <ul className="space-y-1.5 text-surface-400">
              <li>✓ Slider bounds clamped between 0 and 100</li>
              <li>✓ All 4 rubric criteria mandatory before submission</li>
              <li>✓ Timestamp & Judge ID digitally stamped to evaluation</li>
              <li>{isLocked ? '🔒 Score editing is LOCKED' : '🔓 Score editing is OPEN'}</li>
            </ul>
          </div>

          <div className="p-4 bg-surface-900 rounded-xl border border-surface-800 space-y-2">
            <h4 className="font-bold text-surface-200">Post-Submission Audit Trail</h4>
            <div className="text-[11px] font-mono text-surface-500 space-y-1">
              <p>2026-10-13 11:42:01 — Score submitted: 93.4</p>
              <p>2026-10-13 11:44:12 — Qualitative notes edited</p>
              <p className="text-emerald-400">2026-10-13 11:45:00 — Hash signature verified</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
