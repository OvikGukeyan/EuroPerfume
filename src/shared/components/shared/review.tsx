"use client";

import React, { FC, use, useActionState, useState } from "react";
import { cn } from "@/src/lib/utils";
import { DialogCarousel, SubmitButtonBar, Title } from ".";
import { Separator, Textarea } from "../ui";
import { Rating } from "./rating";
import Image from "next/image";
import { Reply, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import { createReply, deleteReview } from "@/src/app/actions";
import { Reply as ReplyType } from "@prisma/client";
import { Link } from "@/src/i18n/navigation";

type Props = {
  className?: string;
  id: number;
  images?: string[];
  text: string;
  userName: string;
  rating: number;
  reply?: ReplyType;
  createdAt: Date;
  productId?: number;
  productName?: string;
  productImage?: string;
};

export const ReviewComponent: FC<Props> = ({
  className,
  id,
  text,
  userName,
  rating,
  images,
  reply,
  productId,
  productName,
  productImage,
  createdAt,
}) => {
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const { data: session } = useSession();
  const admin = session?.user?.role === "ADMIN";

  return (
    <div className={cn("", className)}>
      {(productId && productName && productImage) && (
        <Link href={`/product/${productId}`}>
          <div className="flex gap-10 mb-2">
            <Image
              src={productImage}
              alt={productName}
              width={100}
              height={50}
            />
            <Title
              text={productName}
              size="xs"
              className="font-extrabold my-10"
            />
          </div>
        </Link>
      )}
      <div className="flex items-center justify-between mb-5">
        <Title text={userName} size="xs" className="font-bold mb-5" />
        <Rating value={rating} withNumber />
      </div>
      <p> {text}</p>
      {images && images.length > 0 && (
        <div className="flex gap-2 my-5">
          <DialogCarousel images={images || []} />
        </div>
      )}

      <p className="text-right text-sm text-neutral-500 tracking-widest mt-4">
        {createdAt.toLocaleDateString()}
      </p>

      {reply && (
        <div className="flex items-center justify-between gap-5 md:gap-10 pl-[5%] md:pl-[10%] mt-5">
          <div className="rounded-full overflow-hidden self-start">
            <Image
              src={"/assets/logo-mobile.png"}
              width={40}
              height={40}
              alt="logo"
            />
          </div>
          <div className="flex-1">
            <Title text='Euro Perfume Administrator' size="xs" className="font-bold" />
            <p>{reply.text}</p>
            <p className="text-right text-sm text-neutral-500 tracking-widest">
              {reply.createdAt.toLocaleDateString()}
            </p>
          </div>
        </div>
      )}

      {admin && (
        <>
          <div className="flex justify-end gap-3 my-4">
            <Reply
              onClick={() => setIsReplyOpen(!isReplyOpen)}
              className="cursor-pointer"
              size={20}
            />
            <Trash onClick={() => {deleteReview(id)}} className="cursor-pointer" size={20} />
          </div>
          {isReplyOpen && (
            <form
              className="flex flex-col items-start gap-5"
              action={createReply}
            >
              <Textarea name="reply" required />
              <input type="hidden" name="reviewId" value={id} />
              <SubmitButtonBar />
            </form>
          )}
        </>
      )}

      <Separator className="my-5" />
    </div>
  );
};
