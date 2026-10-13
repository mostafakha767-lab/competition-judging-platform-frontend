import React from 'react';

const variants = {
  primary:
    'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-600/20 hover:shadow-primary-500/30',
  secondary:
    'bg-surface-700 hover:bg-surface-600 text-surface-200 border border-surface-600 hover:border-surface-500',
  danger:
    'bg-danger-600 hover:bg-danger-500 text-white shadow-lg shadow-danger-600/20 hover:shadow-danger-500/30',
  warning:
    'bg-warning-600 hover:bg-warning-500 text-white shadow-lg shadow-warning-600/20 hover:shadow-warning-500/30',
  ghost:
    'bg-transparent hover:bg-surface-800 text-surface-300 hover:text-surface-100',
  success:
    'bg-success-600 hover:bg-success-500 text-white shadow-lg shadow-success-600/20 hover:shadow-success-500/30',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-7 py-3.5 text-base rounded-xl',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        font-semibold tracking-wide
        transition-all duration-200 ease-out
        cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:ring-offset-2 focus:ring-offset-surface-900
        disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none
        active:scale-[0.97]
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${className}
      `.trim()}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
