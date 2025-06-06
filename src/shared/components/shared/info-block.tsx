import React from 'react';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';
import { Title } from './title';
import Link from 'next/link';
import { cn } from '@/src/shared/lib/utils';
import Image from 'next/image';

interface Props {
  title: string;
  text: string;
  className?: string;
  imageUrl?: string;
}

export const InfoBlock: React.FC<Props> = ({ className, title, text, imageUrl }) => {
  return (
    <div className={cn(className, 'flex flex-col-reverse md:flex-row items-center justify-between md:w-[840px] gap-12')}>
      <div className="flex flex-col">
        <div className="md:w-[445px]">
          <Title size="lg" text={title} className="font-extrabold" />
          <p className="text-gray-400 text-lg">{text}</p>
        </div>

        <div className="flex justify-center md:justify-start gap-5 mt-11">
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft />
              Back to home
            </Button>
          </Link>
          <a href="">
            <Button variant="outline" className="text-gray-500 border-gray-400 hover:bg-gray-50">
              Refresh page
            </Button>
          </a>
        </div>
      </div>

      <Image className='w-[150px] md:w-[300px]' src={imageUrl || ''} alt={title} width={300} height={300} />
    </div>
  );
};
