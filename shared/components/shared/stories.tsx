'use client'

import { Api } from '@/shared/services/api-client';
import { IStory } from '@/shared/services/stories';
import React, { FC, useEffect, useState } from 'react'
import { set } from 'react-hook-form';
import { Container } from '.';
import { cn } from '@/shared/lib/utils';
import Image from 'next/image';

interface Props {
  className?: string
}
export const Stories: FC<Props> = ({ className }) => {
  const [stories, setStories] = useState<IStory[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState<IStory>();

  useEffect(() => {
    async function fetchStories() {
      const data = await Api.stories.getAll();
      setStories(data);
    }

    fetchStories();
  }, []);

  const onClickStory = (story: IStory) => {
    setSelectedStory(story);
    if (story.items.length > 0) {
      setOpen(true);
    }
  }
  return (
    <>
      <Container className={cn('flex items-center justify-between gap-2 my-10', className)}>
        {stories.length === 0 &&
          [...Array(6)].map((_, index) => (
            <div key={index} className="w-[200px] h-[250px] bg-gray-200 rounded-md animate-pulse" />
          ))}
        {stories.map((story) => (
          <Image
            key={story.id}
            onClick={() => onClickStory(story)}
            className="rounded-md cursor-pointer"
            height={250}
            width={200}
            alt="story"
            src={story.previewImageUrl}
          />
        ))}
      </Container>
    </>
  )
}
