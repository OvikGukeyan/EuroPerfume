import clsx from 'clsx';
import React from 'react';

type TitleSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface Props {
  size?: TitleSize;
  className?: string;
  text: string;
}

export const Title: React.FC<Props> = ({ text, size = 'sm', className }) => {
  const mapTagBySize = {
    xs: 'h5',
    sm: 'h4',
    md: 'h3',
    lg: 'h2',
    xl: 'h1',
    '2xl': 'h1',
  } as const;

  const mapClassNameBySize = {
    xs: 'text-[16px] font-medium tracking-tight ys-text',
    sm: 'text-[22px] font-medium tracking-tight ys-text',
    md: 'text-[26px] font-medium tracking-tight ys-text',
    lg: 'text-[30px] font-normal tracking-tight ys-display',
    xl: 'text-[36px] font-normal tracking-tight ys-display',
    '2xl': 'text-[42px] font-normal tracking-tight ys-display',
  } as const;

  return React.createElement(
    mapTagBySize[size],
    { className: clsx(mapClassNameBySize[size], className) },
    text,
  );
};
