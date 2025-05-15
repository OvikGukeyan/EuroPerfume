'use client';
import React, { FC } from "react";
import { Button } from "../ui";
import { CircleUser, User } from "lucide-react";
import Link from "next/link";
import { cn } from "@/src/shared/lib/utils";
import { useAuth } from "../../hooks";

interface Props {
  onClickSignIn?: () => void;
  className?: string;
}
export const ProfileButton: FC<Props> = ({ className, onClickSignIn }) => {
  const {user} = useAuth();

  return (
    <div className={cn(className, '')}>
      {!user ? (
        <Button
          onClick={onClickSignIn}
          variant='ghost'
          className="flex items-center gap-1"
        >
          <User size={16} />
          <span className="hidden md:block">Sign-In</span>
        </Button>
      ) : (
        <>
          {user.role === "ADMIN" ? (
            <Link href={"/create/1"}>
              <Button variant="ghost" className="flex items-center gap-2">
                <CircleUser size={18} />
                <span className="hidden md:block">Dashboard</span>
              </Button>
            </Link>
          ) : (
            <Link href={"/profile"}>
              <Button variant="ghost" className="flex items-center gap-2">
                <CircleUser size={18} />
                <span className="hidden md:block">Profile</span>
              </Button>
            </Link>
          )}
        </>
      )}
    </div>
  );
};
