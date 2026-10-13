import React from 'react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-surface-950/70 backdrop-blur-sm" />

      {/* Modal panel */}
      <div
        className={`
          relative w-full ${maxWidth}
          bg-surface-900/95 backdrop-blur-xl
          border border-surface-700/60
          rounded-2xl shadow-2xl shadow-black/50
          animate-fade-in-up
          overflow-hidden
        `.trim()}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-surface-700/60">
            <h3 className="text-lg font-semibold text-surface-100">{title}</h3>
            <button
              onClick={onClose}
              className="p-1 text-surface-500 hover:text-surface-200 transition-colors rounded-lg hover:bg-surface-700/50 cursor-pointer"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  );
}
