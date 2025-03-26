import { cn } from '@/shared/lib/utils';
import { X } from 'lucide-react';
import React from 'react';

interface Props {
  onClick?: VoidFunction;
  className?: string;
}

export const ClearButton: React.FC<Props> = ({ onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={cn("  -translate-y-1/2 opacity-30 hover:opacity-100 cursor-pointer", className)}>
      <X className="h-5 w-5" />
    </button>
  );
};
