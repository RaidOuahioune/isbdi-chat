import React from 'react';
import { Thread } from '../types/chat';

interface ThreadListProps {
  threads: Thread[];
  activeThreadId: string | null;
  onSelectThread: (threadId: string) => void;
  onCreateThread: () => void;
  onDeleteThread: (threadId: string) => void;
}

export const ThreadList: React.FC<ThreadListProps> = ({
  threads,
  activeThreadId,
  onSelectThread,
  onCreateThread,
  onDeleteThread,
}) => {
  // Format date to show only relevant info (e.g., today, yesterday, or date)
  const formatDate = (date: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date >= today) {
      return 'Today';
    } else if (date >= yesterday) {
      return 'Yesterday';
    } else {
      // Format as MM/DD/YYYY for older dates
      return date.toLocaleDateString();
    }
  };

  // Group threads by date (today, yesterday, older)
  const groupedThreads = threads.reduce((acc, thread) => {
    const dateGroup = formatDate(thread.updatedAt);
    if (!acc[dateGroup]) {
      acc[dateGroup] = [];
    }
    acc[dateGroup].push(thread);
    return acc;
  }, {} as Record<string, Thread[]>);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">Conversations</h3>
        <button
          onClick={onCreateThread}
          className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
          title="New conversation"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>

      {Object.keys(groupedThreads).length > 0 ? (
        Object.entries(groupedThreads).map(([dateGroup, threadsInGroup]) => (
          <div key={dateGroup} className="mb-4">
            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">{dateGroup}</h4>
            <ul className="space-y-1.5">
              {threadsInGroup.map((thread) => {
                const isActive = activeThreadId === thread.id;
                return (
                  <li key={thread.id}>
                    <div className={`flex items-center justify-between rounded-md p-2 ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900/20'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}>
                      <button
                        className="flex-1 flex items-center min-w-0 text-left"
                        onClick={() => onSelectThread(thread.id)}
                      >
                        <div className="truncate">
                          <span className={`${
                            isActive ? 'text-blue-700 dark:text-blue-300' : 'text-gray-800 dark:text-gray-200'
                          }`}>
                            {thread.title || 'New conversation'}
                          </span>
                        </div>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteThread(thread.id);
                        }}
                        className="ml-2 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400 text-sm py-4">
          No conversations yet
        </div>
      )}
    </div>
  );
};
