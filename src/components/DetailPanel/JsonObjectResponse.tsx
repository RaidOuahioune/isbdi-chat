import React from 'react';

export const JsonObjectResponse: React.FC<{ jsonObject: Record<string, any> }> = ({ jsonObject }) => {
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
