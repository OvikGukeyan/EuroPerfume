"use client";

import { usePathname, useRouter } from "@/src/i18n/navigation";
import { FC } from "react";
import { cn } from "../../lib/utils";

interface Props {
  className?: string;
}

export const LanguageSwitcher: FC<Props> = ({ className }) => {
  const router = useRouter();
  const pathname = usePathname();

  const changeLanguage = (newLocale: "ru" | "de") => {
    router.push(pathname, { locale: newLocale });
  };

  return (
    <div className={cn("flex gap-3 ", className)}>
      <button onClick={() => changeLanguage("ru")}>RU</button>
      <span className="mx-2">|</span>
      <button onClick={() => changeLanguage("de")}>DE</button>
    </div>
  );
};
