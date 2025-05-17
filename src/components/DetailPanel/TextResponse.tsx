import React from 'react';

export const TextResponse: React.FC<{ content: string }> = ({ content }) => {
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
};
