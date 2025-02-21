import { Button } from '@/shared/components/ui';
import { Dialog, DialogContent } from '@/shared/components/ui/dialog'
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import React, { FC } from 'react'
import { LoginForm } from './forms/login-form';
import { RegisterForm } from './forms/register-form';

interface Props {
    open: boolean;
    onClose: VoidFunction;
    className?: string;
}
export const AuthModal: FC<Props> = ({ className, open, onClose }) => {
    const [type, setType] = React.useState<'login' | 'register'>('login');

    const onSwitchType = () => {
        setType(type === 'login' ? 'register' : 'login');
    }
    const handleClose = () => {
        onClose()
    }
    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className='w-[450px] bg-white p-10'>
                {type === 'login' ? <LoginForm onClose={handleClose}/> : 
                <RegisterForm onClose={handleClose}/>}
                <hr />
                  

                    <Button variant='secondary' className='gap-2 h-12 p-2 flex-1' type='button'
                        onClick={() => {
                            signIn('google'), {
                                callbackUrl: process.env.NEXT_PUBLIC_BASE_URL,
                                redirect: true
                            }
                        }}
                    >
                        <Image src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg" alt="Google" width={24} height={24} />
                        Google
                    </Button>

                <Button onClick={onSwitchType} variant='outline' type='button' className='h-12'>
                    {type === 'login' ? 'Sign Up' : 'Sign In'}
                </Button>
            </DialogContent>
        </Dialog>
    )
}
