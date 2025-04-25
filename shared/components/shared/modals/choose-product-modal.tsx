"use client";

import { Dialog, DialogContent } from "@/shared/components/ui/dialog";
import { cn } from "@/shared/lib/utils";
import { useRouter } from "next/navigation";
import React, { FC } from "react";
import { ProductForm } from "..";
import { Product, ProductVariation, Review } from "@prisma/client";
import { ModalContext } from "@/shared/lib";
import { ProductDTO } from "@/shared/services/dto/product.dto";

interface Props {
  product: ProductDTO;
  className?: string;
}
export const ChooseProductModal: FC<Props> = ({ className, product }) => {
  const router = useRouter();

  const onCloseModal = () => {
    router.back();
  };

  return (
    <Dialog open={Boolean(product)} onOpenChange={onCloseModal}>
      <DialogContent
        style={{ scrollbarWidth: "none" }}
        className={cn(
          "p-0 w-full h-[100svh] md:w-[600px] lg:h-auto lg:w-[1060px] max-w-[1060px] min-h-[600px]  bg-white md:rounded-sm overflow-y-scroll  ",
          className
        )}
      >
        <ModalContext.Provider value={{ isModal: true }}>
          <ProductForm product={product} onSubmit={onCloseModal} />
        </ModalContext.Provider>
      </DialogContent>
    </Dialog>
  );
};
