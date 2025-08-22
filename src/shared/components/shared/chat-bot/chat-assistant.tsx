'use client';

import React from 'react';
import { Button } from '@/src/shared/components/ui/button';
import { useChat } from '@/src/shared/hooks';
import { MessageInput, MessageList } from '.';

export function ChatAssistant({ locale = 'ru' }: { locale?: 'ru' | 'de' }) {
  const { messages, send, stop, clear, isStreaming, listEndRef } = useChat({ locale });

  return (
    <div className="flex h-full w-full max-w-3xl flex-col rounded-xl border bg-white shadow">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-3">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />
          <p className="text-sm font-semibold">
            AI-консультант {locale.toUpperCase()}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={clear} disabled={isStreaming}>
          Очистить
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1">
        <MessageList messages={messages} endRef={listEndRef} />
      </div>

      {/* Input */}
      <MessageInput onSend={send} onStop={stop} isStreaming={isStreaming} />
    </div>
  );
}