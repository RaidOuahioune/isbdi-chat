import React from 'react';
import ReactMarkdown from 'react-markdown';

// Helper function to check if a string might contain markdown
const containsMarkdown = (text: string): boolean => {
  // Check for common markdown patterns
  const markdownPatterns = [
    /\*\*(.*?)\*\*/,  // Bold
    /\*(.*?)\*/,      // Italic
    /\[.*?\]\(.*?\)/, // Links
    /^#+\s/m,         // Headers
    /^-\s/m,          // List items
    /^\d+\.\s/m,      // Numbered list
    /^>\s/m,          // Blockquotes
    /```[\s\S]*?```/, // Code blocks
    /`.*?`/           // Inline code
  ];
  
  return markdownPatterns.some(pattern => pattern.test(text));
};

// Helper function to render nested objects recursively
const renderNestedObject = (obj: any, depth: number = 0): JSX.Element => {
  if (obj === null) return <span className="text-gray-500 italic">null</span>;
  
  if (Array.isArray(obj)) {
    return (
      <ul className="list-disc pl-5 space-y-2 my-2">
        {obj.map((item, i) => (
          <li key={i} className="text-gray-800 dark:text-gray-200">
            {typeof item === 'object' && item !== null 
              ? renderNestedObject(item, depth + 1)
              : typeof item === 'string' && containsMarkdown(item)
                ? <ReactMarkdown>{item}</ReactMarkdown>
                : String(item)}
          </li>
        ))}
      </ul>
    );
  }
  
  if (typeof obj === 'object') {
    return (
      <div className={`${depth > 0 ? 'border-l-2 border-gray-300 dark:border-gray-600 pl-4 my-2' : ''}`}>
        {Object.entries(obj).map(([key, value], i) => (
          <div key={key} className="mb-3">
            <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">
              {key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.replace(/_/g, ' ').slice(1)}:
            </div>
            <div className="pl-2">
              {typeof value === 'object' && value !== null
                ? renderNestedObject(value, depth + 1)
                : typeof value === 'string' && containsMarkdown(value)
                  ? <ReactMarkdown>{value}</ReactMarkdown>
                  : <span className="text-gray-800 dark:text-gray-200">{String(value)}</span>}
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  return <span>{String(obj)}</span>;
};

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
                    renderNestedObject(value)
                  ) : typeof value === 'string' && containsMarkdown(value) ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown>{value}</ReactMarkdown>
                    </div>
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
