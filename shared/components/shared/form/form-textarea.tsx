'use client'

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { ClearButton, Textarea } from '../..';

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  name: string;
  label?: string;
  required?: boolean;
}

export const FormTextarea: React.FC<Props> = ({ className, name, label, required, ...props }) => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();

  const errorText = errors?.[name]?.message as string;

  const value = watch(name);

  const onClickClear = () => {
    setValue(name, '');
  };

  return (
    <div className={className}>
      <p className="font-medium mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </p>
      <div className="relative ">
        <Textarea className="h-12 text-md resize-none" {...register(name)} {...props} />
        {value && (<div className='absolute right-4 top-1/2' ><ClearButton onClick={onClickClear} /></div>)}
      </div>
      {errorText && <p className="text-red-500 text-sm mt-2">{errorText}</p>}
    </div>
  );
};
