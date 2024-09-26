import { Container, GroupVariants, ProductImage, Title } from '@/shared/components/shared'
import { prisma } from '@/prisma/prisma-client'
import { notFound } from 'next/navigation'
import React from 'react'

export default async function Product({ params: { id } }: { params: { id: string } }) {

  const product = await prisma.product.findFirst({ where: { id: Number(id) } })

  if (!product) {
    return notFound()
  }

  return (
    <Container className='flex flex-col my-10'>
      <div className='flex flex-1'>
        <ProductImage size={40} imageUrl={product.imageUrl} />


        <div className='w-[490px] bg-[#f2f2f2] p-7'>
        <Title text={product.name} size="md" className='font-extrabold mb-1' />

        <p className='text-gray-400'> Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ex modi architecto exercitationem, ipsum animi mollitia rerum ipsa culpa labore nisi incidunt fugiat ducimus ea reiciendis! Distinctio voluptates perferendis tenetur aliquid!</p>
        <GroupVariants items={[]}/>
        </div>
      </div>

    </Container>
  )
}
