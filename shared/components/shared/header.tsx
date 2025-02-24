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
import { Truck } from "lucide-react";
import { Separator } from "../ui";
import { useInitFiltersFromUrl } from "@/shared/hooks";
import { createProduct } from "@/app/actions";
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
    createProduct( {
    name: "Chanel No. 6",
    imageUrl:
      "https://media.douglas.de/medias/zUsfEz1217085-0-dgl-DE.jpg?context=bWFzdGVyfGltYWdlc3w4Mzg1NnxpbWFnZS9qcGVnfGFHUXdMMmhsTmk4Mk16QTNNelEyT1RnNU1EVTVNQzk2VlhObVJYb3hNakUzTURnMVh6QmZaR2RzTFVSRkxtcHdad3wyYmMxMGVhZGQ5ZjdiNWRjZDMyZDU1Y2QwMTQ4MWY4MzE4NjhkYTJiZjNkODU0MGE3ZTQxOTk4NzA0YWUyYzE4&grid=true&imPolicy=grayScaled&imdensity=1&imwidth=775",
    description: "Classic perfume by Chanel.",
    price: 150,
    stoke: 100,
    gender: ["FEMALE"],
    concentration: "EAU_DE_PARFUM",
    brand: "CHANEL", 
    notes: ["CITRUS", "GREEN"],
    types: ["DESIGNER"],
    releaseYear: 1921,
    category: {
      connect: {
        id: 1
      }
    },
  },)
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
    <header className={cn("", className)}>
      <Container className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Truck/>
          <h3>Free shipping available for orders above $100</h3>
        </div>
      </Container>
      <Separator />
      <Container className="flex items-center justify-between py-8">
        <Link href={"/"}>
          <div className="flex items-center gap-4 ">
            <Image src={"/assets/Logo.png"} width={120} height={40} alt="logo" />
          </div>
        </Link>

        {hasSearch && (
          <div className="mx-10 flex-1 hidden md:flex">
            <SearchInput />
          </div>
        )}

        <div className="flex  items-center gap-3">
          <AuthModal
            open={openAuthModal}
            onClose={() => setOpenAuthModal(false)}
          />
          <ProfileButton onClickSignIn={() => setOpenAuthModal(true)} />

          {hasCart && <CartButton />}
        </div>
      </Container>
    </header>
  );
};
