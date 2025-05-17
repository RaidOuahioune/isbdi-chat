import React from 'react';
import ReactMarkdown from 'react-markdown';
import { UseCaseResponseData } from './types';

export const UseCaseResponse: React.FC<{ data: UseCaseResponseData }> = ({ data }) => {
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
            <div className="prose dark:prose-invert prose-sm max-w-none">
              <ReactMarkdown>{data.scenario}</ReactMarkdown>
            </div>
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
            <div className="prose dark:prose-invert prose-sm max-w-none">
              <ReactMarkdown>{data.accounting_guidance}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
