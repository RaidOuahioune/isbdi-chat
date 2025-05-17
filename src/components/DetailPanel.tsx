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

  // Render Use Case (Journaling) response
  const renderUseCaseResponse = (data: { scenario: string; accounting_guidance: string }) => {
    return (
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-1">
        <div className="absolute inset-0 bg-grid-white/15 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.3))]"></div>
        <div className="relative rounded-lg bg-white/95 dark:bg-gray-900/95 p-6 backdrop-blur-sm">
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-300 tracking-tight">SCENARIO</h3>
            </div>
            <div className="bg-blue-50 dark:bg-gray-800 rounded-lg p-6 border-l-4 border-blue-500 dark:border-blue-400 shadow-md">
              <p className="text-gray-800 dark:text-gray-200 text-lg font-medium leading-relaxed">{data.scenario}</p>
            </div>
          </div>
          
          <div>
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 dark:text-indigo-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 tracking-tight">ACCOUNTING GUIDANCE</h3>
            </div>
            <div className="bg-indigo-50 dark:bg-gray-800 rounded-lg p-6 border-l-4 border-indigo-500 dark:border-indigo-400 shadow-md">
              <p className="text-gray-800 dark:text-gray-200 text-lg whitespace-pre-wrap leading-relaxed">{data.accounting_guidance}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render Analyzer response
  const renderAnalyzerResponse = (data: {
    analysis: string;
    identifiedStandards?: string[];
    retrievalStats?: {
      chunk_count: number;
      chunks_summary: string[];
    };
  }) => {
    return (
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 p-1">
        <div className="absolute inset-0 bg-grid-white/15 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.3))]"></div>
        <div className="relative rounded-lg bg-white/95 dark:bg-gray-900/95 p-6 backdrop-blur-sm">
          {/* Analysis Section */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-300" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 9a2 2 0 114 0 2 2 0 01-4 0z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a4 4 0 00-3.446 6.032l-2.261 2.26a1 1 0 101.414 1.415l2.261-2.261A4 4 0 1011 5z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-purple-700 dark:text-purple-300 tracking-tight">ANALYSIS</h3>
            </div>
            <div className="bg-purple-50 dark:bg-gray-800 rounded-lg p-6 border-l-4 border-purple-500 dark:border-purple-400 shadow-md">
              <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">{data.analysis}</p>
            </div>
          </div>
          
          {/* Identified Standards Section */}
          {data.identifiedStandards && data.identifiedStandards.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-900 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-600 dark:text-pink-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-pink-700 dark:text-pink-300 tracking-tight">IDENTIFIED STANDARDS</h3>
              </div>
              <div className="bg-pink-50 dark:bg-gray-800 rounded-lg p-6 border-l-4 border-pink-500 dark:border-pink-400 shadow-md">
                <ul className="space-y-2">
                  {data.identifiedStandards.map((standard, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-pink-200 dark:bg-pink-800 text-pink-700 dark:text-pink-300 text-sm font-medium mr-3 mt-0.5">{index + 1}</span>
                      <span className="text-gray-800 dark:text-gray-200 text-lg">{standard}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {/* Retrieval Statistics Section */}
          {data.retrievalStats && (
            <div>
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 dark:text-indigo-300" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 tracking-tight">RETRIEVAL STATISTICS</h3>
              </div>
              <div className="bg-indigo-50 dark:bg-gray-800 rounded-lg p-6 border-l-4 border-indigo-500 dark:border-indigo-400 shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center mr-4">
                    <span className="text-indigo-700 dark:text-indigo-300 font-bold text-lg">{data.retrievalStats.chunk_count}</span>
                  </div>
                  <div>
                    <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">CHUNKS PROCESSED</p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">Total data segments analyzed</p>
                  </div>
                </div>
                
                {data.retrievalStats.chunks_summary && data.retrievalStats.chunks_summary.length > 0 && (
                  <div>
                    <p className="font-medium text-indigo-700 dark:text-indigo-300 mb-3 text-sm uppercase tracking-wider">Summary of Processed Chunks</p>
                    <ul className="space-y-2">
                      {data.retrievalStats.chunks_summary.map((summary, index) => (
                        <li key={index} className="flex items-start bg-white/60 dark:bg-gray-700/60 p-2 rounded-md">
                          <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-indigo-200 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-medium mr-2 mt-0.5">{index + 1}</span>
                          <span className="text-gray-700 dark:text-gray-300 text-sm">{summary}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Helper function to render JSON object with each field as a section
  const renderJsonObject = (jsonObject: Record<string, any>) => {
    return (
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 p-1">
        <div className="absolute inset-0 bg-grid-white/15 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.3))]"></div>
        <div className="relative rounded-lg bg-white/95 dark:bg-gray-900/95 p-6 backdrop-blur-sm">
          <div className="flex items-center mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 tracking-tight">RESPONSE DATA</h3>
          </div>
          
          <div className="space-y-6">
            {Object.entries(jsonObject).map(([key, value], index) => {
              const fieldColors = [
                { bg: 'bg-blue-50', border: 'border-blue-500', text: 'text-blue-700', dark: { bg: 'dark:bg-gray-800', border: 'dark:border-blue-400', text: 'dark:text-blue-300' } },
                { bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-700', dark: { bg: 'dark:bg-gray-800', border: 'dark:border-green-400', text: 'dark:text-green-300' } },
                { bg: 'bg-purple-50', border: 'border-purple-500', text: 'text-purple-700', dark: { bg: 'dark:bg-gray-800', border: 'dark:border-purple-400', text: 'dark:text-purple-300' } },
                { bg: 'bg-amber-50', border: 'border-amber-500', text: 'text-amber-700', dark: { bg: 'dark:bg-gray-800', border: 'dark:border-amber-400', text: 'dark:text-amber-300' } },
                { bg: 'bg-rose-50', border: 'border-rose-500', text: 'text-rose-700', dark: { bg: 'dark:bg-gray-800', border: 'dark:border-rose-400', text: 'dark:text-rose-300' } },
                { bg: 'bg-cyan-50', border: 'border-cyan-500', text: 'text-cyan-700', dark: { bg: 'dark:bg-gray-800', border: 'dark:border-cyan-400', text: 'dark:text-cyan-300' } },
              ];
              
              const colorSet = fieldColors[index % fieldColors.length];
              
              return (
                <div key={key} className="rounded-lg overflow-hidden shadow-sm">
                  <div className={`flex items-center px-4 py-3 ${colorSet.bg} ${colorSet.dark.bg} border-b ${colorSet.border} ${colorSet.dark.border}`}>
                    <h4 className={`font-semibold capitalize ${colorSet.text} ${colorSet.dark.text}`}>
                      {key.replace(/_/g, ' ')}
                    </h4>
                  </div>
                  <div className={`${colorSet.bg} ${colorSet.dark.bg} p-4 rounded-b-lg border-l-4 ${colorSet.border} ${colorSet.dark.border}`}>
                    {typeof value === 'object' && value !== null ? (
                      Array.isArray(value) ? (
                        <ul className="list-disc pl-5 space-y-1">
                          {value.map((item, i) => (
                            <li key={i} className="text-gray-800 dark:text-gray-200">
                              {typeof item === 'object' && item !== null ? JSON.stringify(item, null, 2) : String(item)}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-mono">
                          {JSON.stringify(value, null, 2)}
                        </pre>
                      )
                    ) : (
                      <p className="text-gray-800 dark:text-gray-200">{String(value)}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Format content based on type
  const renderContent = () => {
    if (!content) return null;
    
    // Try to parse string content as JSON
    if (typeof content === 'string') {
      try {
        const parsedJson = JSON.parse(content);
        if (typeof parsedJson === 'object' && parsedJson !== null) {
          // Check if it's a Use Case (Journaling) response
          if ('scenario' in parsedJson && 'accounting_guidance' in parsedJson) {
            return renderUseCaseResponse(parsedJson as { scenario: string; accounting_guidance: string });
          }
          
          // Check if it's an Analyzer response
          if ('analysis' in parsedJson) {
            return renderAnalyzerResponse(parsedJson as {
              analysis: string;
              identifiedStandards?: string[];
              retrievalStats?: {
                chunk_count: number;
                chunks_summary: string[];
              };
            });
          }
          
          // Default JSON object rendering
          return renderJsonObject(parsedJson);
        }
      } catch (e) {
        // Not valid JSON, render as string
        return (
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 p-1">
            <div className="absolute inset-0 bg-grid-white/15 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.3))]"></div>
            <div className="relative rounded-lg bg-white/95 dark:bg-gray-900/95 p-6 backdrop-blur-sm">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600 dark:text-teal-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-teal-700 dark:text-teal-300">Response</h3>
              </div>
              <div className="bg-teal-50 dark:bg-gray-800 rounded-lg p-5 border-l-4 border-teal-500 dark:border-teal-400 shadow-sm">
                <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed">{content}</p>
              </div>
            </div>
          </div>
        );
      }
    }
    
    // Handle object content
    if (typeof content === 'object' && content !== null) {
      // Check if it's a Use Case (Journaling) response
      if ('scenario' in content && 'accounting_guidance' in content) {
        return renderUseCaseResponse(content as { scenario: string; accounting_guidance: string });
      }
      
      // Check if it's an Analyzer response
      if ('analysis' in content) {
        return renderAnalyzerResponse(content as {
          analysis: string;
          identifiedStandards?: string[];
          retrievalStats?: {
            chunk_count: number;
            chunks_summary: string[];
          };
        });
      }
      
      // Default object rendering
      return renderJsonObject(content);
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
