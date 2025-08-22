'use client';
import React, { useState } from 'react';
import { Button } from '@/src/shared/components/ui/button';
import { Textarea } from '../..';

export function MessageInput({
  onSend,
  onStop,
  isStreaming,
  placeholder = 'Опишите, что вы ищете…',
}: {
  onSend: (text: string) => void;
  onStop: () => void;
  isStreaming: boolean;
  placeholder?: string;
}) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSend(value);
    setValue('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-end gap-2 border-t p-2">
      <Textarea
        className=" w-full min-h-[50px] max-h-48 resize-none p-2 text-sm outline-none"
        placeholder={placeholder}
        disabled={isStreaming}
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      {isStreaming ? (
        <Button type="button" variant="destructive" onClick={onStop}>
          Стоп
        </Button>
      ) : (
        <Button type="submit" disabled={!value.trim()}>
          Отправить
        </Button>
      )}
    </form>
  );
}