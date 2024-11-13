import { Button } from '@/shared/components/ui';
import { Dialog, DialogContent } from '@/shared/components/ui/dialog'
import { Github } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { redirect } from 'next/dist/server/api-utils';
import Image from 'next/image';
import React, { FC } from 'react'

interface Props {
    open: boolean;
    onClose: () => void;
    className?: string;
}
export const AuthModal: FC<Props> = ({ className, open, onClose }) => {
    const handleClose = () => {
        onClose()
    }
    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className='w-[450px] bg-white p-10'>
                FORM
                <hr />
                <div className='flex gap-2'>
                    <Button variant='secondary' className='gap-2 h-12 p-2 flex-1' type='button'
                        onClick={() => {
                            signIn('github'), {
                                callbackUrl: 'http://localhost:3000',
                                redirect: true
                            }
                        }}
                    >
                        <Image src="https://github.githubassets.com/favicons/favicon.svg" alt="GitHub" width={24} height={24} />
                        GitHub
                    </Button>

                    <Button variant='secondary' className='gap-2 h-12 p-2 flex-1' type='button'
                        onClick={() => {
                            signIn('google'), {
                                callbackUrl: 'http://localhost:3000',
                                redirect: true
                            }
                        }}
                    >
                        <Image src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg" alt="Google" width={24} height={24} />
                       Google
                    </Button>

                </div>
            </DialogContent>
        </Dialog>
    )
}
