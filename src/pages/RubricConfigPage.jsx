import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePlatform } from '../context/PlatformContext';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';

export default function RubricConfigPage() {
  const { id } = useParams();
  const { selectedCompetitionId, currentCompetition } = usePlatform();
  const compId = id || selectedCompetitionId || 'comp-002';

  const [criteria, setCriteria] = useState([
    { id: 'crit-1', name: 'Technical Execution & Complexity', weight: 35, maxScore: 100 },
    { id: 'crit-2', name: 'Innovation & Problem Solving', weight: 25, maxScore: 100 },
    { id: 'crit-3', name: 'Real-World Applicability & Impact', weight: 20, maxScore: 100 },
    { id: 'crit-4', name: 'Presentation & Defense', weight: 20, maxScore: 100 },
  ]);

  const [saved, setSaved] = useState(false);
  const totalWeight = criteria.reduce((acc, c) => acc + Number(c.weight), 0);

  const handleWeightChange = (index, val) => {
    const updated = [...criteria];
    updated[index].weight = Number(val);
    setCriteria(updated);
    setSaved(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <PageHeader
        owner="Yousef"
        featureModule="Feature 3 — Admin Competition & Judging Setup"
        title="Judge Assignment & Rubric Configuration"
        description="Configure evaluation criteria weights, scoring scales, and assign judge evaluation panels to competitions."
        route={`/admin/competitions/${compId}/rubric`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rubric Criteria Builder */}
        <div className="lg:col-span-2 glass-card p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-surface-100">
              Evaluation Criteria & Weight Matrix
            </h3>
            <span
              className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg ${
                totalWeight === 100
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}
            >
              Total Weight: {totalWeight}% {totalWeight === 100 ? '✓ Valid' : '(! Must equal 100%)'}
            </span>
          </div>

          {saved && (
            <Alert
              type="success"
              title="Rubric Version Updated"
              message={`Rubric configuration published for competition ${compId}. Judges will evaluate according to these criteria weights.`}
              onDismiss={() => setSaved(false)}
            />
          )}

          <div className="space-y-3">
            {criteria.map((c, idx) => (
              <div
                key={c.id}
                className="p-4 rounded-xl bg-surface-900/80 border border-surface-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <h4 className="text-sm font-semibold text-surface-200">{c.name}</h4>
                  <span className="text-xs text-surface-500 font-mono">Max Scale: 0 - {c.maxScore} pts</span>
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-xs text-surface-400">Weight %:</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={c.weight}
                    onChange={(e) => handleWeightChange(idx, e.target.value)}
                    className="w-20 px-3 py-1.5 bg-surface-950 border border-surface-700 rounded-lg text-xs font-mono font-bold text-primary-300 text-center focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              variant="primary"
              disabled={totalWeight !== 100}
              onClick={() => setSaved(true)}
            >
              Save Rubric Configuration
            </Button>
          </div>
        </div>

        {/* Assigned Judges Panel */}
        <div className="glass-card p-6 space-y-4">
          <h3 className="text-base font-bold text-surface-100">Assigned Judges Panel</h3>
          <p className="text-xs text-surface-400">
            Judges assigned to evaluate live presentations in {currentCompetition?.name}:
          </p>

          <div className="space-y-2 text-xs">
            {[
              { name: 'Dr. Omar Mustafa', role: 'Lead AI Evaluator', status: 'ONLINE' },
              { name: 'Eng. Lubna Al-Sayed', role: 'Technical Architecture Judge', status: 'ONLINE' },
              { name: 'Prof. Tariq Mansour', role: 'Industry Advisor', status: 'OFFLINE' },
            ].map((j, i) => (
              <div key={i} className="p-3 bg-surface-950/80 rounded-xl border border-surface-800 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-surface-200">{j.name}</p>
                  <p className="text-[10px] text-surface-500">{j.role}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  j.status === 'ONLINE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-surface-800 text-surface-500'
                }`}>
                  {j.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
