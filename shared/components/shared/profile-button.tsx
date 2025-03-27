import { signIn, useSession } from "next-auth/react";
import React, { FC } from "react";
import { Button } from "../ui";
import { CircleUser, User } from "lucide-react";
import Link from "next/link";

interface Props {
  onClickSignIn?: () => void;
  className?: string;
}
export const ProfileButton: FC<Props> = ({ className, onClickSignIn }) => {
  const { data: session } = useSession();
  return (
    <div>
      {!session ? (
        <Button
          onClick={onClickSignIn}
          variant="outline"
          className="flex items-center gap-1"
        >
          <User size={16} />
          <span className="hidden md:block">Sign-In</span>
        </Button>
      ) : (
        <>
          {session.user.role === "ADMIN" ? (
            <Link href={"/create/1"}>
              <Button variant="secondary" className="flex items-center gap-2">
                <CircleUser size={18} />
                <span className="hidden md:block">Dashboard</span>
              </Button>
            </Link>
          ) : (
            <Link href={"/profile"}>
              <Button variant="secondary" className="flex items-center gap-2">
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
