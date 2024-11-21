'use client'

import { cn } from '@/shared/lib/utils';
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { AuthModal, CartButton, Container, ProfileButton, SearchInput } from '@/shared/components/shared';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
interface Props {
  hasSearch?: boolean
  hasCart?: boolean
  className?: string
}

export const Header: React.FC<Props> = ({ className, hasSearch = true, hasCart = true }) => {
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const paid = searchParams.has('paid');
    const failed = searchParams.has('faild');
    const verified = searchParams.has('verified');
    if (paid) {

      setTimeout(() => {
        toast.success('Payment successful!');
        router.push('/');
      }, 500);
    } else if (failed) {
      setTimeout(() => {
        toast.error('Payment failed!');
        router.push('/');
      }, 500);
    } else if (verified) {
      setTimeout(() => {
        toast.success('Email verified!');
        router.push('/');
      }, 500);
    }
  }, [router, searchParams]);
  return (
    <header className={cn(' border-b', className)}>
      <Container className='flex items-center justify-between py-8'>
        <Link href={'/'}>
          <div className='flex items-center gap-4 '>
            <Image src={'/logo.png'} width={35} height={35} alt='logo' />
            <div className='hidden sm:block'>
              <h1 className="text-2xl uppercase font-black">Ovik Pizza</h1>
              <p className="text-sm text-gray-400 leading-3">There is nowhere better</p>
            </div>
          </div>
        </Link>

        {hasSearch && <div className='mx-10 flex-1 hidden sm:flex'>
          <SearchInput />

        </div>}

        <div className="flex  items-center gap-3">
          <AuthModal open={openAuthModal} onClose={() => setOpenAuthModal(false)} />
          <ProfileButton onClickSignIn={() => setOpenAuthModal(true)} />

          {hasCart && <CartButton />}

        </div>
      </Container>
    </header>
  )
}
