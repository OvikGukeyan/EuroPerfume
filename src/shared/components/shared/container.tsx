import { cn } from '@/src/shared/lib/utils';
import React from 'react';

interface Props {
  className?: string;
}

export const Container: React.FC<React.PropsWithChildren<Props>> = ({ className, children }) => {
  return <div style={{scrollbarWidth: 'none'}} className={cn('mx-auto max-w-[1440px] p-4', className)}>{children}</div>;
};
