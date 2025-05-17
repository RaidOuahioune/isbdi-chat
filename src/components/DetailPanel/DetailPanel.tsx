import React, { useEffect, useRef } from 'react';
import { DetailPanelProps, UseCaseResponseData, AnalyzerResponseData } from './types';
import { UseCaseResponse } from './UseCaseResponse';
import { AnalyzerResponse } from './AnalyzerResponse';
import { JsonObjectResponse } from './JsonObjectResponse';
import { TextResponse } from './TextResponse';

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
    console.log("renderContent", content);
    console.log("typeof content", typeof content);
    if (!content) return null;
    
    // Try to parse string content as JSON
    if (typeof content === 'string') {
      try {
        const parsedJson = JSON.parse(content);
        if (typeof parsedJson === 'object' && parsedJson !== null) {
          // Check if it's a Use Case (Journaling) response
          if ('scenario' in parsedJson && 'accounting_guidance' in parsedJson) {
            return <UseCaseResponse data={parsedJson as UseCaseResponseData} />;
          }
          
          // Check if it's an Analyzer response
          if ('analysis' in parsedJson) {
            return <AnalyzerResponse data={parsedJson as AnalyzerResponseData} />;
          }
          
          // Default JSON object rendering
          return <JsonObjectResponse jsonObject={parsedJson} />;
        }
      } catch (e) {
        // Not valid JSON, render as string
        return <TextResponse content={content} />;
      }
    }
    
    // Handle object content
    if (typeof content === 'object' && content !== null) {
      // Check if it's a Use Case (Journaling) response
      if ('scenario' in content && 'accounting_guidance' in content) {
        return <UseCaseResponse data={content as UseCaseResponseData} />;
      }
      
      // Check if it's an Analyzer response
      if ('analysis' in content) {
        return <AnalyzerResponse data={content as AnalyzerResponseData} />;
      }
      
      // Default object rendering
      return <JsonObjectResponse jsonObject={content} />;
    }
    
    // Fallback for other content types
    return <div>{String(content)}</div>;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black bg-opacity-50 flex justify-end">
      <div 
        ref={panelRef}
        className="bg-white dark:bg-gray-800 w-full max-w-4xl h-full shadow-xl flex flex-col animate-slide-in-right"
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
        <div className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
