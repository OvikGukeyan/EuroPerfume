import React from "react";
import { ChatMessage } from "./types";
import { MessageBubble } from ".";

export function MessageList({
  messages,
  endRef,
}: {
  messages: ChatMessage[];
  endRef: React.RefObject<HTMLDivElement>;
}) {
  return (
    <div className="flex flex-col gap-3 overflow-y-auto p-3">
      {messages.map((m) => (
        <MessageBubble key={m.id} msg={m} />
      ))}
      <div ref={endRef} />
    </div>
  );
}
