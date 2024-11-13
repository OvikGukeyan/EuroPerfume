import React, { FC } from 'react'
import { useForm } from 'react-hook-form';
import { formLoginSchema, TFormLoginValues } from './schemas';
import { zodResolver } from '@hookform/resolvers/zod';


interface Props {
    onClose: VoidFunction;
    className?: string;
}
export const LoginForm: FC<Props> = ({className, onClose}) => {
    const form = useForm<TFormLoginValues>({
        resolver: zodResolver(formLoginSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    });
  return (
    <div>
        
    </div>
  )
}
