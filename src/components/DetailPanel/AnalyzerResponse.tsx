import React from 'react';
import ReactMarkdown from 'react-markdown';
import { AnalyzerResponseData } from './types';

export const AnalyzerResponse: React.FC<{ data: AnalyzerResponseData }> = ({ data }) => {

  console.log("AnalyzerResponse", data);
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
            <div className="prose dark:prose-invert prose-sm max-w-none">
              <ReactMarkdown>{data.analysis}</ReactMarkdown>
            </div>
          </div>
        </div>
        
        {/* Compliance Status Section */}
        {data.compliant !== undefined && (
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 mr-4">
                {data.compliant ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 dark:text-red-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <h3 className="text-2xl font-bold text-green-700 dark:text-green-300 tracking-tight">COMPLIANCE STATUS</h3>
            </div>
            <div className={`rounded-lg p-6 border-l-4 shadow-md ${data.compliant ? 'bg-green-50 dark:bg-gray-800 border-green-500 dark:border-green-400' : 'bg-red-50 dark:bg-gray-800 border-red-500 dark:border-red-400'}`}>
              <div className="flex items-center">
                <span className={`inline-flex items-center justify-center h-8 w-8 rounded-full ${data.compliant ? 'bg-green-200 dark:bg-green-800 text-green-700 dark:text-green-300' : 'bg-red-200 dark:bg-red-800 text-red-700 dark:text-red-300'} text-sm font-medium mr-3`}>
                  {data.compliant ? 'Yes' : 'No'}
                </span>
                <span className="text-gray-800 dark:text-gray-200 text-lg font-medium">{data.compliant ? 'Compliant' : 'Non-Compliant'}</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Rationale Section */}
        {data.rationale && (
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-300 tracking-tight">RATIONALE</h3>
            </div>
            <div className="bg-blue-50 dark:bg-gray-800 rounded-lg p-6 border-l-4 border-blue-500 dark:border-blue-400 shadow-md">
              <div className="prose dark:prose-invert prose-sm max-w-none">
                <ReactMarkdown>{data.rationale}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}
        
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
