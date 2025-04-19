"use client";

import { cn } from "@/shared/lib/utils";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AuthModal,
  CartButton,
  MenuDrawer,
  ProfileButton,
  SearchInput,
} from "@/shared/components/shared";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Heart, Truck } from "lucide-react";
import { Button, Separator } from "../ui";
import { useInitFiltersFromUrl } from "@/shared/hooks";
interface Props {
  hasSearch?: boolean;
  hasCart?: boolean;
  className?: string;
}

export const Header: React.FC<Props> = ({
  className,
  hasSearch = true,
  hasCart = true,
}) => {
  // console.log(newNotes, Notes)
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  useInitFiltersFromUrl();
  useEffect(() => {
    const paid = searchParams.has("paid");
    const failed = searchParams.has("faild");
    const verified = searchParams.has("verified");
    if (paid) {
      setTimeout(() => {
        toast.success("Payment successful!");
        router.push("/");
      }, 500);
    } else if (failed) {
      setTimeout(() => {
        toast.error("Payment failed!");
        router.push("/");
      }, 500);
    } else if (verified) {
      setTimeout(() => {
        toast.success("Email verified!");
        router.push("/");
      }, 500);
    }
  }, [router, searchParams]);

  return (
    <>
      <div className="flex items-center gap-3 h-10  px-3 md:px-5">
        <Truck />
        <h3 className="text-sm md:text-base">
          Free shipping available for orders above $100
        </h3>
      </div>
      <header className={cn("", className)}>
        <Separator />
        <div className="flex items-center justify-between py-3 md:py-10 px-3 md:px-5 ">
          <div className="md:hidden flex items-center">
            <MenuDrawer />
            <ProfileButton onClickSignIn={() => setOpenAuthModal(true)} />
          </div>
          <div className={cn("relative flex justify-center items-center w-36 md:w-44 h-10 ", hasSearch && 'mx-auto')}>
            <Link href="/">
              <Image
                src="/assets/logo.png"
                layout="fill"
                objectFit="contain"
                objectPosition="center"
                alt="logo"
                className="w-full h-full"
              />
            </Link>
          </div>

          {hasSearch && (
            <div className="mx-10 flex-1 hidden md:flex">
              <SearchInput />
            </div>
          )}
          <div></div>

          <div className="flex  items-center gap-0 md:gap-3">
            <AuthModal
              className="hidden "
              open={openAuthModal}
              onClose={() => setOpenAuthModal(false)}
            />
            <ProfileButton
              className="hidden md:block"
              onClickSignIn={() => setOpenAuthModal(true)}
            />

            <Button
              onClick={() => router.push("/favorites")}
              variant={"ghost"}
              size={"icon"}
              // loading={loading}
            >
              <Heart size={20} />
            </Button>

            {hasCart && <CartButton />}
          </div>
        </div>
      </header>
    </>
  );
};
