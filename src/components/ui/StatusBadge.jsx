import React from 'react';

const statusConfig = {
  DRAFT: { label: 'Draft', color: 'bg-surface-600 text-surface-200' },
  ACTIVE: { label: 'Active', color: 'bg-primary-600/80 text-primary-100' },
  COMPLETED: { label: 'Completed', color: 'bg-success-600/80 text-green-100' },
  ARCHIVED: { label: 'Archived', color: 'bg-surface-700 text-surface-400' },
  PUBLISHED: { label: 'Published', color: 'bg-success-600/80 text-green-100' },
  UNPUBLISHED: { label: 'Unpublished', color: 'bg-warning-600/80 text-yellow-100' },
  PENDING: { label: 'Pending', color: 'bg-surface-600 text-surface-200' },
  VISITED: { label: 'Visited', color: 'bg-primary-600/80 text-primary-100' },
  SKIPPED: { label: 'Skipped', color: 'bg-warning-600/80 text-yellow-100' },
  EVALUATED: { label: 'Evaluated', color: 'bg-success-600/80 text-green-100' },
  NOT_EVALUATED: { label: 'Not Evaluated', color: 'bg-surface-600 text-surface-300' },
};

export default function StatusBadge({ status, className = '' }) {
  const config = statusConfig[status] || {
    label: status,
    color: 'bg-surface-600 text-surface-300',
  };

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-1
        text-xs font-semibold tracking-wider uppercase
        rounded-full
        ${config.color}
        ${className}
      `.trim()}
    >
      {config.label}
    </span>
  );
}
