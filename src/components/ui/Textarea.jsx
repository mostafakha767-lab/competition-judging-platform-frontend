import React from 'react';

export default function Textarea({
  label,
  id,
  error,
  rows = 4,
  className = '',
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-surface-300 tracking-wide"
        >
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        className={`
          w-full px-4 py-3
          bg-surface-800/60 border rounded-xl
          text-surface-100 placeholder-surface-500
          text-sm resize-none
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-primary-400/40 focus:border-primary-500
          ${error ? 'border-danger-500 focus:ring-danger-400/40' : 'border-surface-700 hover:border-surface-500'}
        `.trim()}
        {...props}
      />
      {error && (
        <p className="text-xs text-danger-500 flex items-center gap-1 animate-slide-down">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
