import 'next/server';
export const runtime = 'nodejs'; // или 'edge' — см. комментарии ниже

type InMsg = { role: 'system'|'user'|'assistant'|'tool'; content: string };
type Body = { messages: InMsg[]; locale?: 'ru'|'de' };

const SYS_PROMPT = (locale: 'ru'|'de' = 'ru') => `
You are Euro Perfume AI Consultant. Reply in ${locale === 'ru' ? 'Russian' : 'German'}.
- Be concise, helpful and product-aware.
- If unsure, ask clarifying questions.
- Prices in €; avoid hallucinating stock.
`;

export async function POST(req: Request) {
  const { messages, locale = 'ru' } = (await req.json()) as Body;

  // простая защита от слишком больших запросов
  const tokensApprox = messages.map(m => m.content).join(' ').length;
  if (tokensApprox > 8000) {
    return new Response('data: Request too large\n\n', { headers: sseHeaders() });
  }

  // ---- (опционально) быстрый RAG-хук: подтягиваем контекст (см. раздел 5) ----
  const ragContext = await retrieveContext(messages.at(-1)?.content || '');

  // Собираем сообщения к модели
  const openaiMessages = [
    { role: 'system', content: SYS_PROMPT(locale) + (ragContext ? `\nContext:\n${ragContext}` : '') },
    ...messages.map(m => ({ role: m.role, content: m.content })),
  ];

  // Создаём SSE-стрим
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const resp = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',        // лёгкий и быстрый
            temperature: 0.4,
            stream: true,
            messages: openaiMessages,
          }),
        });

        if (!resp.ok || !resp.body) {
          controller.enqueue(encoder.encode(`data: [ERROR] HTTP ${resp.status}\n\n`));
          controller.close();
          return;
        }

        const reader = resp.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });

          // проксируем поток OpenAI как SSE: строка за строкой
          for (const line of chunk.split('\n')) {
            const t = line.trim();
            if (!t) continue;
            // OpenAI присылает "data: {json}" и "data: [DONE]"
            controller.enqueue(encoder.encode(`${t}\n`));
          }
        }

        controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
        controller.close();
      } catch (e: any) {
        controller.enqueue(encoder.encode(`data: [ERROR] ${e?.message || 'failed'}\n\n`));
        controller.close();
      }
    },
  });

  return new Response(stream, { headers: sseHeaders() });
}

function sseHeaders() {
  return {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  };
}

// —— Заглушка под RAG (см. секцию 5)
async function retrieveContext(query: string): Promise<string> {
  if (!query || query.length < 4) return '';
  // здесь можно дернуть векторный поиск / полнотекст
  return '';
}