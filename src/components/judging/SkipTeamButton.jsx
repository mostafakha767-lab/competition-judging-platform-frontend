import React, { useState } from 'react';
import { skipTeam } from '../../api/competitionApi';
import { useApiCall } from '../../hooks/useApiCall';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Textarea from '../ui/Textarea';
import Alert from '../ui/Alert';
import StatusBadge from '../ui/StatusBadge';

/**
 * SkipTeamButton
 *
 * Admin action to skip a team that is not ready at their assigned slot.
 * Opens a confirmation modal with a reason input.
 *
 * Core Domain Rule:
 *   Skipping a team sets workflowStatus to "SKIPPED" and evaluationStatus to "NOT_EVALUATED".
 *   It MUST NOT mark the team as evaluated, and MUST NOT assign a score of zero.
 *
 * API: POST /api/v1/competitions/:competitionId/teams/:teamId/skip
 * Request Body: { reason: "..." }
 */
export default function SkipTeamButton({ competitionId, teamId, teamName, onSkipped, disabled = false }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [validationError, setValidationError] = useState('');

  const { execute, data: skipResult, loading, error, success, reset } = useApiCall(skipTeam);

  const handleOpen = () => {
    setIsModalOpen(true);
    setReason('');
    setValidationError('');
    reset();
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setReason('');
    setValidationError('');
  };

  const handleConfirmSkip = async () => {
    if (!reason.trim()) {
      setValidationError('Please provide a reason for skipping this team');
      return;
    }

    try {
      const result = await execute(competitionId, teamId, reason.trim());
      if (onSkipped) onSkipped(result);
    } catch {
      // Error captured in hook state
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <Button
        variant="warning"
        size="sm"
        onClick={handleOpen}
        disabled={disabled}
        id={`skip-team-${teamId}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
        </svg>
        Skip Team
      </Button>

      {/* Skip Confirmation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title="Skip Team"
      >
        {success && skipResult ? (
          <div className="space-y-4">
            <Alert
              type="warning"
              title="Team Skipped"
              message={`${teamName || teamId} has been skipped and will not be evaluated at this time.`}
            />

            <div className="p-4 bg-surface-800/40 rounded-xl border border-surface-700/50 space-y-3">
              <h4 className="text-sm font-semibold text-surface-200">Skip Result</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-surface-500 text-xs">Workflow Status</span>
                  <div className="mt-1">
                    <StatusBadge status={skipResult.workflowStatus} />
                  </div>
                </div>
                <div>
                  <span className="text-surface-500 text-xs">Evaluation Status</span>
                  <div className="mt-1">
                    <StatusBadge status={skipResult.evaluationStatus} />
                  </div>
                </div>
              </div>

              {/* Domain rule reminder */}
              <div className="mt-3 p-3 bg-surface-800/60 rounded-lg border border-surface-700/40">
                <p className="text-xs text-surface-400 flex items-start gap-2">
                  <svg className="w-4 h-4 text-primary-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>
                    This team has been skipped — it has <strong className="text-surface-300">not</strong> been marked
                    as evaluated and no score of zero has been assigned. The admin can revisit
                    this team later using the Active Team controls.
                  </span>
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="secondary" onClick={handleClose} size="sm">
                Close
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Warning banner */}
            <div className="flex items-start gap-3 p-4 bg-warning-600/10 border border-warning-600/20 rounded-xl">
              <svg className="w-6 h-6 text-warning-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-warning-500">
                  Are you sure you want to skip this team?
                </p>
                <p className="text-sm text-surface-400 mt-1">
                  <strong className="text-surface-300">{teamName || teamId}</strong> will be marked
                  as <strong className="text-surface-300">SKIPPED</strong> and remain <strong className="text-surface-300">NOT_EVALUATED</strong>.
                  No score will be assigned. You can revisit this team later.
                </p>
              </div>
            </div>

            {/* Error */}
            {error && (
              <Alert
                type="error"
                title={`Skip Failed (${error.code})`}
                message={error.message}
                details={error.details}
                onDismiss={reset}
              />
            )}

            {/* Reason input */}
            <Textarea
              id="skip-reason"
              label="Reason for Skipping *"
              placeholder="e.g., Team is not present at the assigned slot."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (validationError) setValidationError('');
              }}
              error={validationError}
              rows={3}
            />

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={handleClose} disabled={loading}>
                Cancel
              </Button>
              <Button
                variant="warning"
                loading={loading}
                onClick={handleConfirmSkip}
                id="confirm-skip-btn"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
                Confirm Skip
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
