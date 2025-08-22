import { useCallback, useMemo, useRef, useState } from 'react';
import { ChatMessage, SendPayload } from '../components/shared/chat-bot/types';

export function useChat({ locale }: { locale: 'ru' | 'de' }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const listEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = useCallback(() => {
    listEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, []);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsStreaming(false);
  }, []);

  const send = useCallback(async (userText: string) => {
    if (!userText.trim() || isStreaming) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: userText.trim(),
      createdAt: Date.now(),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsStreaming(true);
    scrollToBottom();

    const controller = new AbortController();
    abortRef.current = controller;

    // собираем форму запроса
    const payload: SendPayload = {
      locale,
      messages: [...messages, userMsg].slice(-12).map(m => ({
        role: m.role,
        content: m.content,
      })),
    };

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify(payload),
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok || !res.body) {
        throw new Error(`HTTP ${res.status}`);
      }

      // создаём и «постепенно наполняем» ответ бота
      const assistantId = crypto.randomUUID();
      setMessages(prev => [
        ...prev,
        { id: assistantId, role: 'assistant', content: '', createdAt: Date.now() },
      ]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        acc += decoder.decode(value, { stream: true });

        // SSE: строки вида "data: ...\n\n"
        const lines = acc.split('\n');
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;

          const data = trimmed.slice(5).trim();
          if (!data || data === '[DONE]') continue;

          setMessages(prev =>
            prev.map(m => (m.id === assistantId ? { ...m, content: m.content + data } : m)),
          );
        }
        scrollToBottom();
        acc = ''; // очищаем буфер (упрощённый парсер, для реала можно хранить хвост)
      }
    } catch (e: any) {
      // помечаем последнюю запись ошибкой или добавляем новую
      setMessages(prev => {
        const last = [...prev].pop();
        if (!last || last.role !== 'assistant' || last.content) {
          return [
            ...prev,
            {
              id: crypto.randomUUID(),
              role: 'assistant',
              content: '',
              createdAt: Date.now(),
              error: e?.message ?? 'Request aborted',
            },
          ];
        }
        return prev.map(m => (m.id === last.id ? { ...m, error: e?.message ?? 'Request aborted' } : m));
      });
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
      scrollToBottom();
    }
  }, [isStreaming, messages, locale, scrollToBottom]);

  const clear = useCallback(() => {
    stop();
    setMessages([]);
  }, [stop]);

  return useMemo(
    () => ({ messages, send, stop, clear, isStreaming, listEndRef }),
    [messages, send, stop, clear, isStreaming],
  );
}