'use client';
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import React, { FC } from "react";
import { Button } from "../ui";
import { CircleUser, User, UserRoundCheck } from "lucide-react";
import { cn } from "@/src/shared/lib/utils";
import { Link } from "@/src/i18n/navigation";


interface Props {
  onClickSignIn?: () => void;
  className?: string;
}
export const ProfileButton: FC<Props> = ({ className, onClickSignIn }) => {
  const { data: session } = useSession();
  const ru = useLocale() === "ru";

  return (
    <div className={cn(className, '')}>
      {!session ? (
        <Button
          onClick={onClickSignIn}
          aria-label={ru ? "Войти" : "Anmelden"}
          variant='ghost'
          className="flex items-center gap-1"
        >
          <User size={16} />
          <span className="hidden md:block">{ru ? "Войти" : "Anmelden"}</span>
        </Button>
      ) : (
        <>
          {session.user.role === "ADMIN" ? (
            <Link href={"/create/1"}>
              <Button variant="ghost" className="flex items-center gap-2">
                <CircleUser size={18} />
                <span className="hidden md:block">{ru ? "Управление" : "Verwaltung"}</span>
              </Button>
            </Link>
          ) : (
            <Link href={"/profile"}>
              <Button variant="ghost" className="flex items-center gap-2">
                <UserRoundCheck size={18} />
                <span className="hidden md:block">{ru ? "Личный кабинет" : "Mein Konto"}</span>
              </Button>
            </Link>
          )}
        </>
      )}
    </div>
  );
};
