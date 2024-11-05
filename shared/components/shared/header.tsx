import { cn } from '@/shared/lib/utils';
import React from 'react'
import Image from 'next/image';
import { User } from 'lucide-react';
import Link from 'next/link';
import { CartButton, Container, SearchInput } from '@/shared/components/shared';
import { Button } from '@/shared/components/ui';

interface Props {
  hasSearch?: boolean
  hasCart?: boolean
  className?: string
}

export const Header: React.FC<Props> = ({ className, hasSearch=true, hasCart=true }) => {
  return (
    <header className={cn(' border-b', className)}>
      <Container className='flex items-center justify-between py-8'>
        <Link href={'/'}>
          <div className='flex items-center gap-4 '>
            <Image src={'/logo.png'} width={35} height={35} alt='logo' />
            <div>
              <h1 className="text-2xl uppercase font-black">Ovik Pizza</h1>
              <p className="text-sm text-gray-400 leading-3">There is nowhere better</p>
            </div>
          </div>
        </Link>

        {hasSearch && <div className='mx-10 flex-1 hidden sm:flex'>
          <SearchInput/>

        </div>}

        <div className="flex  items-center gap-3">
          {/* <Button variant='outline' className='flex items-center gap-1'>
            <User size={16} />
            Sign-In
          </Button> */}

            {hasCart && <CartButton/>}

        </div>
      </Container>
    </header>
  )
}
