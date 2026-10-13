import React, { useState, useEffect } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Alert from '../ui/Alert';
import StatusBadge from '../ui/StatusBadge';

/**
 * UpdateCompetitionForm.jsx
 * Owner: Mostafa khaled
 * Feature: Feature 3 — Admin Competition and Judging Setup
 *
 * API Contract:
 *   PATCH /api/v1/competitions/:competitionId
 *   Request Body:
 *     { "name": "Updated Competition Name", "description": "Updated description" }
 *   Response (200 OK):
 *     { "success": true, "data": { ...updatedCompetition } }
 */
export default function UpdateCompetitionForm({ competitionId, onUpdated }) {
  const { competitions, updateCompetition } = usePlatform();

  const targetComp = competitions.find((c) => c.id === competitionId) || null;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [apiError, setApiError] = useState(null);

  // Sync inputs whenever competitionId or targetComp changes
  useEffect(() => {
    if (targetComp) {
      setName(targetComp.name || '');
      setDescription(targetComp.description || '');
      setIsDirty(false);
      setSuccessMessage(null);
      setApiError(null);
    }
  }, [competitionId, targetComp?.id]);

  const validate = () => {
    const errors = {};
    if (!name.trim()) {
      errors.name = 'Competition name is required';
    } else if (name.trim().length < 3) {
      errors.name = 'Name must be at least 3 characters long';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setApiError(null);
    setSuccessMessage(null);

    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
      };

      const result = await updateCompetition(competitionId, payload);
      setIsDirty(false);
      setSuccessMessage(`Saved changes for ${competitionId} (${result.name})`);
      if (onUpdated) onUpdated(result);
    } catch (err) {
      setApiError({
        code: err.code || 'COMPETITION_UPDATE_FAILED',
        message: err.message || 'Failed to update competition',
        details: err.details || [],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (setter) => (e) => {
    setter(e.target.value);
    setIsDirty(true);
    setSuccessMessage(null);
  };

  if (!targetComp) {
    return (
      <div className="glass-card p-8 animate-fade-in-up">
        <Alert
          type="error"
          title="Competition Not Found"
          message={`Unable to find competition with ID "${competitionId}" in platform state.`}
        />
      </div>
    );
  }

  return (
    <div className="glass-card p-6 sm:p-8 animate-fade-in-up border border-indigo-500/20 shadow-xl shadow-indigo-950/20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-surface-800 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-2xl border border-indigo-500/30">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-surface-100">Update Competition Form</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 uppercase">
                [Mostafa khaled]
              </span>
            </div>
            <p className="text-xs text-surface-400 mt-0.5">
              Endpoint: <code className="text-primary-300 font-mono">PATCH /api/v1/competitions/{competitionId}</code>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-surface-500">Current Status:</span>
          <StatusBadge status={targetComp.status} />
          <StatusBadge status={targetComp.resultsStatus} />
        </div>
      </div>

      {/* Success alert */}
      {successMessage && (
        <div className="mb-6 animate-slide-down">
          <Alert
            type="success"
            title="HTTP 200 OK — Competition Details Updated"
            message={successMessage}
            onDismiss={() => setSuccessMessage(null)}
          />
        </div>
      )}

      {/* Error alert */}
      {apiError && (
        <div className="mb-6">
          <Alert
            type="error"
            title={`Update Failed (${apiError.code})`}
            message={apiError.message}
            details={apiError.details}
            onDismiss={() => setApiError(null)}
          />
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6" id="update-competition-form">
        <Input
          id="update-comp-name"
          label="Competition Name *"
          placeholder="e.g. AI Innovation Challenge 2026"
          value={name}
          onChange={(e) => {
            handleFieldChange(setName)(e);
            if (validationErrors.name) {
              setValidationErrors((prev) => ({ ...prev, name: undefined }));
            }
          }}
          error={validationErrors.name}
        />

        <Textarea
          id="update-comp-description"
          label="Description"
          placeholder="Updated competition description..."
          value={description}
          onChange={handleFieldChange(setDescription)}
          rows={4}
        />

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3">
            <Button
              type="submit"
              loading={loading}
              disabled={!isDirty}
              id="update-competition-btn"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Changes (PATCH)
            </Button>

            {isDirty && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setName(targetComp.name || '');
                  setDescription(targetComp.description || '');
                  setIsDirty(false);
                }}
              >
                Cancel Changes
              </Button>
            )}
          </div>

          {isDirty && (
            <span className="text-xs text-amber-400 animate-fade-in flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-ping" />
              Unsaved changes detected
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
