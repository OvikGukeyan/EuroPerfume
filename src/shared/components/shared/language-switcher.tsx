"use client";

import { usePathname, useRouter } from "@/src/i18n/navigation";
import { FC } from "react";
import { cn } from "../../lib/utils";
import { useSearchParams } from "next/navigation";

interface Props {
  className?: string;
}

export const LanguageSwitcher: FC<Props> = ({ className }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

const changeLanguage = (newLocale: "ru" | "de") => {
  const query = searchParams.toString(); 

  const url = query ? `${pathname}?${query}` : pathname;

  router.push(url, { locale: newLocale });
};

  return (
    <div className={cn("flex gap-3 ", className)}>
      <button onClick={() => changeLanguage("ru")}>RU</button>
      <span className="mx-2">|</span>
      <button onClick={() => changeLanguage("de")}>DE</button>
    </div>
  );
};
