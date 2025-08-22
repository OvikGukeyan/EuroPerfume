import React from 'react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/src/shared/lib/utils';
import { ChatMessage } from './types';

export function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === 'user';
  return (
    <div
      className={cn(
        'max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-6',
        isUser ? 'ml-auto bg-black text-white' : 'mr-auto bg-zinc-100 text-zinc-900',
      )}
      aria-live={isUser ? undefined : 'polite'}
    >
      {msg.error ? (
        <p className="text-red-600">⚠️ {msg.error}</p>
      ) : (
        <ReactMarkdown 
        // className="prose prose-sm max-w-none"
        >
          {msg.content || '…'}
        </ReactMarkdown>
      )}
    </div>
  );
}