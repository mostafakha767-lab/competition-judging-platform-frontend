import React from 'react';

// Color map for developer owners to make them distinct and visually prominent
const OWNER_COLORS = {
  'Mostafa khaled': {
    bg: 'bg-indigo-500/20',
    border: 'border-indigo-500/40',
    text: 'text-indigo-300',
    dot: 'bg-indigo-400',
    tag: 'Feature 3 (Assigned Scope)',
  },
  'Hala': {
    bg: 'bg-pink-500/20',
    border: 'border-pink-500/40',
    text: 'text-pink-300',
    dot: 'bg-pink-400',
    tag: 'Authentication & Navigation',
  },
  'Abdallah': {
    bg: 'bg-amber-500/20',
    border: 'border-amber-500/40',
    text: 'text-amber-300',
    dot: 'bg-amber-400',
    tag: 'Roles & Participants',
  },
  'Hala / Abdallah': {
    bg: 'bg-purple-500/20',
    border: 'border-purple-500/40',
    text: 'text-purple-300',
    dot: 'bg-purple-400',
    tag: 'Auth & Protected Routes',
  },
  'Yousef': {
    bg: 'bg-emerald-500/20',
    border: 'border-emerald-500/40',
    text: 'text-emerald-300',
    dot: 'bg-emerald-400',
    tag: 'Teams, Review & Rubrics',
  },
  'Omar Mustafa': {
    bg: 'bg-cyan-500/20',
    border: 'border-cyan-500/40',
    text: 'text-cyan-300',
    dot: 'bg-cyan-400',
    tag: 'Judge Dashboard & Teams',
  },
  'Lubna / Omar Mustafa': {
    bg: 'bg-teal-500/20',
    border: 'border-teal-500/40',
    text: 'text-teal-300',
    dot: 'bg-teal-400',
    tag: 'Evaluation Form & Criteria',
  },
  'Lubna': {
    bg: 'bg-blue-500/20',
    border: 'border-blue-500/40',
    text: 'text-blue-300',
    dot: 'bg-blue-400',
    tag: 'Validation & Edit States',
  },
  'Adham': {
    bg: 'bg-violet-500/20',
    border: 'border-violet-500/40',
    text: 'text-violet-300',
    dot: 'bg-violet-400',
    tag: 'Rankings & Tie-Break',
  },
  'Kermin': {
    bg: 'bg-orange-500/20',
    border: 'border-orange-500/40',
    text: 'text-orange-300',
    dot: 'bg-orange-400',
    tag: 'Public Results & Top 10',
  },
};

export default function PageHeader({
  owner,
  featureModule,
  title,
  description,
  route,
  children,
}) {
  const ownerConfig = OWNER_COLORS[owner] || {
    bg: 'bg-surface-700/50',
    border: 'border-surface-600',
    text: 'text-surface-200',
    dot: 'bg-surface-400',
    tag: 'Team Member',
  };

  const isMyScope = owner === 'Mostafa khaled';

  return (
    <div className="mb-6 p-6 rounded-2xl bg-surface-900/60 border border-surface-700/50 backdrop-blur-md shadow-xl animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            {/* Required Owner Badge */}
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${ownerConfig.bg} ${ownerConfig.border} ${ownerConfig.text} shadow-sm`}
            >
              <span className={`w-2 h-2 rounded-full ${ownerConfig.dot} animate-pulse`} />
              <span>Owner: {owner}</span>
              {isMyScope && (
                <span className="ml-1 px-1.5 py-0.2 bg-indigo-500 text-white text-[10px] uppercase font-bold rounded">
                  My Scope
                </span>
              )}
            </div>

            {/* Feature Module Tag */}
            {featureModule && (
              <span className="px-2.5 py-1 rounded-full bg-surface-800 border border-surface-700 text-surface-400 text-xs font-medium">
                {featureModule}
              </span>
            )}

            {/* Route Path */}
            {route && (
              <span className="px-2.5 py-1 rounded-full bg-surface-950/80 border border-surface-800 text-primary-300 font-mono text-xs">
                {route}
              </span>
            )}
          </div>

          {/* Title and Description */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-surface-100 tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="mt-1.5 text-sm text-surface-400 max-w-3xl leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Action controls / buttons slot */}
        {children && (
          <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
