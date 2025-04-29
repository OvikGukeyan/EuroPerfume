import clsx from 'clsx';
import React from 'react';

type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface Props {
  size?: TextSize;
  className?: string;
  children: React.ReactNode;
}

export const Text: React.FC<Props> = ({ children, size = 'sm', className }) => {
  const mapClassNameBySize = {
    xs: 'text-[12px] leading-tight',
    sm: 'text-[14px] leading-normal',
    md: 'text-[16px] leading-relaxed',
    lg: 'text-[18px] leading-relaxed',
    xl: 'text-[20px] leading-loose',
  } as const;

  return (
    <p className={clsx(mapClassNameBySize[size], className)}>
      {children}
    </p>
  );
};
