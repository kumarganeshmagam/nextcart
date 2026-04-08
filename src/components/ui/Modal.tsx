import React, { Fragment } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  'data-testid'?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  'data-testid': testId,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      data-testid={testId}
    >
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        data-testid={testId ? `${testId}-overlay` : 'modal-overlay'}
      />

      {/* Modal Content */}
      <div
        className="relative w-full max-w-lg transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all"
        data-testid={testId ? `${testId}-content` : 'modal-content'}
      >
        <div className="flex items-center justify-between mb-4">
          {title && (
            <h3 className="text-lg font-semibold text-slate-900" data-testid={testId ? `${testId}-title` : 'modal-title'}>
              {title}
            </h3>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-500 transition-colors"
            data-testid={testId ? `${testId}-close-btn` : 'modal-close-btn'}
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};
