"use client";

import React, { FC, useState } from "react";
import { ClearButton, ErrorText, RequiredSymbol } from "..";
import { Input } from "../../ui";
import { useFormContext } from "react-hook-form";
import { Eye, EyeClosed } from "lucide-react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  required?: boolean;
  className?: string;
}
export const FormInput: FC<Props> = ({
  className,
  name,
  label,
  required,
  type,
  ...props
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const handleVisibilityClick = () => {
    setPasswordVisible(!passwordVisible);
  };
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();

  const value = watch(name);
  const errorText = errors[name]?.message as string;

  const onClickClear = () => {
    setValue(name, "", { shouldValidate: true });
  };

  return (
    <div className={className}>
      {label && (
        <p className="font-medium mb-2">
          {label} {required && <RequiredSymbol />}
        </p>
      )}

      <div className="relative">
        <Input
          type={type === "password" && passwordVisible ? "text" : type}
          className="h-12 text-md"
          {...register(name)}
          {...props}
        />
        <div className="absolute right-4 top-1/2 flex items-center gap-2">
          {value && <ClearButton onClick={onClickClear} />}
          {type === "password" && (
            <>
              {passwordVisible ? (
                <button
                  onClick={handleVisibilityClick}
                  className="-translate-y-1/2 opacity-30 hover:opacity-100 cursor-pointer"
                >
                  <Eye className="h-5 w-5" />
                </button>
              ) : (
                <button
                  onClick={handleVisibilityClick}
                  className="-translate-y-1/2 opacity-30 hover:opacity-100 cursor-pointer"
                >
                  <EyeClosed className="h-5 w-5" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {errorText && <ErrorText text={errorText} className="mt-2" />}
    </div>
  );
};
