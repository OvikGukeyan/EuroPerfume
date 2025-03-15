"use client";

import { cn } from "@/shared/lib/utils";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AuthModal,
  CartButton,
  Container,
  ProfileButton,
  SearchInput,
} from "@/shared/components/shared";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Heart, Truck } from "lucide-react";
import { Button, Separator } from "../ui";
import { useFavorites, useInitFiltersFromUrl } from "@/shared/hooks";
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
  const { favoritesLoading: loading } = useFavorites();

  return (
    <>
      <div className="flex items-center gap-4 h-10  px-3 md:px-5">
        <Truck />
        <h3 className="text-sm md:text-base">Free shipping available for orders above $100</h3>
      </div>
      <header className={cn("", className)}>
        <Separator />
        <div className="flex items-center justify-between py-2 md:py-10 px-3 md:px-5 ">
          <Link href={"/"}>
            <div className="flex items-center gap-4 ">
              <Image
                src={"/assets/logo.jpg"}
                width={120}
                height={40}
                alt="logo"
                className="mr-3"
              />
            </div>
          </Link>

          {hasSearch && (
            <div className="mx-10 flex-1 hidden md:flex">
              <SearchInput />
            </div>
          )}

          <div className="flex  items-center gap-3">
            <Button
              onClick={() => router.push("/favorites")}
              variant={"secondary"}
              loading={loading}
            >
              <Heart />
            </Button>
            <AuthModal
              open={openAuthModal}
              onClose={() => setOpenAuthModal(false)}
            />
            <ProfileButton onClickSignIn={() => setOpenAuthModal(true)} />

            {hasCart && <CartButton />}
          </div>
        </div>
      </header>
    </>
  );
};
