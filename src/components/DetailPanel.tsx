import React, { useEffect, useRef } from 'react';

interface DetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: any;
}

export const DetailPanel: React.FC<DetailPanelProps> = ({
  isOpen,
  onClose,
  title,
  content
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Format content based on type
  const renderContent = () => {
    if (!content) return null;
    
    if (typeof content === 'string') {
      return <pre className="whitespace-pre-wrap text-sm">{content}</pre>;
    }
    
    if (typeof content === 'object') {
      return (
        <pre className="whitespace-pre-wrap text-sm">
          {JSON.stringify(content, null, 2)}
        </pre>
      );
    }
    
    return <div>{String(content)}</div>;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black bg-opacity-50 flex justify-end">
      <div 
        ref={panelRef}
        className="bg-white dark:bg-gray-800 w-full max-w-md h-full shadow-xl flex flex-col animate-slide-in-right"
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-medium">{title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 p-4 overflow-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

// Add animation to tailwind.config.js
// extend: {
//   animation: {
//     'slide-in-right': 'slideInRight 0.3s ease-out',
//   },
//   keyframes: {
//     slideInRight: {
//       '0%': { transform: 'translateX(100%)' },
//       '100%': { transform: 'translateX(0)' },
//     },
//   },
// },
