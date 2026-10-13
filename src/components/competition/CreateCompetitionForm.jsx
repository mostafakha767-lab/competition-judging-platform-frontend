import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlatform } from '../../context/PlatformContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Alert from '../ui/Alert';
import StatusBadge from '../ui/StatusBadge';

/**
 * CreateCompetitionForm.jsx
 * Owner: Mostafa khaled
 * Feature: Feature 3 — Admin Competition and Judging Setup
 *
 * API Contract:
 *   POST /api/v1/competitions
 *   Request Body:
 *     { "name": "AI Innovation Challenge 2026", "description": "Student AI project competition" }
 *   Response (201 Created):
 *     { "success": true, "data": { "id": "comp-...", "name": "...", "description": "...", "status": "DRAFT", "resultsStatus": "UNPUBLISHED" } }
 */
export default function CreateCompetitionForm({ onCreated }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [createdCompetition, setCreatedCompetition] = useState(null);
  const [apiError, setApiError] = useState(null);

  const { createCompetition } = usePlatform();
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};
    if (!name.trim()) {
      errors.name = 'Competition name is required';
    } else if (name.trim().length < 3) {
      errors.name = 'Competition name must be at least 3 characters long';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setApiError(null);

    try {
      const payload = {
        name: name.trim(),
        description: description.trim() || undefined,
      };

      const result = await createCompetition(payload);
      setCreatedCompetition(result);
      if (onCreated) onCreated(result);
    } catch (err) {
      setApiError({
        code: err.code || 'COMPETITION_CREATION_FAILED',
        message: err.message || 'Failed to create competition',
        details: err.details || [],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setName('');
    setDescription('');
    setValidationErrors({});
    setCreatedCompetition(null);
    setApiError(null);
  };

  return (
    <div className="glass-card p-6 sm:p-8 animate-fade-in-up border border-indigo-500/20 shadow-xl shadow-indigo-950/20">
      {/* Header with Developer Assignment Tag */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-surface-800 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-2xl border border-indigo-500/30">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-surface-100">Create Competition Form</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 uppercase">
                [Mostafa khaled]
              </span>
            </div>
            <p className="text-xs text-surface-400 mt-0.5">
              Endpoint: <code className="text-primary-300 font-mono">POST /api/v1/competitions</code>
            </p>
          </div>
        </div>

        {/* API Contract Badge */}
        <div className="px-3 py-1.5 rounded-xl bg-surface-900 border border-surface-800 text-[11px] font-mono text-surface-400 self-start sm:self-auto">
          Status on 201: <span className="text-emerald-400 font-semibold">DRAFT / UNPUBLISHED</span>
        </div>
      </div>

      {/* Success Notification & Details Card */}
      {createdCompetition && (
        <div className="mb-6 space-y-4 animate-slide-down">
          <Alert
            type="success"
            title="HTTP 201 Created — Competition Initialized!"
            message={`"${createdCompetition.name}" was successfully registered in the platform state.`}
          />

          <div className="p-5 bg-surface-900/90 rounded-2xl border border-surface-800 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-surface-400">
                Created Competition Payload (Envelope: data)
              </h4>
              <span className="text-xs text-emerald-400 font-mono font-semibold">HTTP 201 Created</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-surface-950 rounded-xl border border-surface-800">
                <span className="text-surface-500 block mb-1">Competition ID</span>
                <span className="text-primary-300 font-mono font-bold">{createdCompetition.id}</span>
              </div>
              <div className="p-3 bg-surface-950 rounded-xl border border-surface-800">
                <span className="text-surface-500 block mb-1">Workflow Status</span>
                <StatusBadge status={createdCompetition.status} />
              </div>
              <div className="p-3 bg-surface-950 rounded-xl border border-surface-800">
                <span className="text-surface-500 block mb-1">Results Status</span>
                <StatusBadge status={createdCompetition.resultsStatus} />
              </div>
              <div className="p-3 bg-surface-950 rounded-xl border border-surface-800">
                <span className="text-surface-500 block mb-1">Active Team</span>
                <span className="text-surface-400 font-mono">None (null)</span>
              </div>
            </div>

            {/* Quick Actions to jump right into judging controls */}
            <div className="pt-2 flex flex-wrap gap-2.5">
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(`/admin/competitions/${createdCompetition.id}/active-control`)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                Launch Active-Team Controls
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate(`/admin/competitions/${createdCompetition.id}/edit`)}
              >
                Edit Competition Details
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
              >
                + Create Another Competition
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {apiError && (
        <div className="mb-6">
          <Alert
            type="error"
            title={`Error (${apiError.code})`}
            message={apiError.message}
            details={apiError.details}
            onDismiss={() => setApiError(null)}
          />
        </div>
      )}

      {/* Form Fields */}
      {!createdCompetition && (
        <form onSubmit={handleSubmit} className="space-y-6" id="create-competition-form">
          <Input
            id="comp-name"
            label="Competition Name *"
            placeholder="e.g., AI Innovation Challenge 2026"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (validationErrors.name) {
                setValidationErrors((prev) => ({ ...prev, name: undefined }));
              }
            }}
            error={validationErrors.name}
            autoFocus
          />

          <Textarea
            id="comp-description"
            label="Description (Optional)"
            placeholder="Enter competition details, eligibility, or guidelines..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />

          <div className="p-4 rounded-xl bg-surface-900/60 border border-surface-800 text-xs text-surface-400 flex items-start gap-3">
            <svg className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-semibold text-surface-200">Specification Compliance:</p>
              <p className="mt-0.5">
                New competitions are automatically initialized with state <code className="text-primary-300">status: "DRAFT"</code> and{' '}
                <code className="text-primary-300">resultsStatus: "UNPUBLISHED"</code> per Section 3.1 of the Technical Architecture.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              loading={loading}
              id="create-competition-btn"
              className="px-6"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Competition
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={handleReset}
              disabled={loading}
            >
              Reset Form
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
