"use client";

import * as React from "react";
import { Button } from "@/src/shared/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/shared/components/ui/popover";
import { Share2, Clipboard, Check, Mail, MessageCircle, Send, Facebook, Twitter } from "lucide-react";
import { usePathname } from "next/navigation";

type ShareButtonProps = {
  title: string;           // Заголовок товара
  text?: string;           // Короткое описание (по желанию)
  url?: string;            // Свой URL, если не задан — возьмём текущий
  className?: string;
  utm?: { source?: string; medium?: string; campaign?: string }; // опциональные UTM
};

export function ShareButton({
  title,
  text,
  url,
  className,
  utm,
}: ShareButtonProps) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  // формируем каноническую ссылку
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  let shareUrl = url ?? (origin ? origin + pathname : pathname);
  if (utm && origin) {
    const u = new URL(shareUrl, origin);
    if (utm.source) u.searchParams.set("utm_source", utm.source);
    if (utm.medium) u.searchParams.set("utm_medium", utm.medium);
    if (utm.campaign) u.searchParams.set("utm_campaign", utm.campaign);
    shareUrl = u.toString();
  }

  const canNativeShare =
    typeof navigator !== "undefined" &&
    typeof navigator.share === "function" &&
    // Safari на десктопе иногда объявляет share, но не работает без тач-устройств:
    (navigator as any).canShare
      ? (navigator as any).canShare({ url: shareUrl })
      : true;

  async function handleNativeShare() {
    try {
      await navigator.share({
        title,
        text,
        url: shareUrl,
      });
      // если сработал native share — закрываем поповер (на случай открытия)
      setOpen(false);
    } catch {
      // пользователь мог отменить — игнорируем
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Фоллбек на старые браузеры
      const ta = document.createElement("textarea");
      ta.value = shareUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }

  // готовим ссылки для мессенджеров/соцсетей
  const encoded = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const whatsappHref = `https://wa.me/?text=${encodedTitle}%20${encoded}`;
  const telegramHref = `https://t.me/share/url?url=${encoded}&text=${encodedTitle}`;
  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encoded}`;
  const xHref = `https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`;
  const mailHref = `mailto:?subject=${encodedTitle}&body=${encodeURIComponent(text ?? "")}%0A${encoded}`;

  // Если есть нативный share — показываем одну кнопку
  if (canNativeShare) {
    return (
      <Button type="button" onClick={handleNativeShare} className={className} variant="outline">
        <Share2 className="mr-2 h-4 w-4" />
        Поделиться
      </Button>
    );
  }

  // Иначе — показываем Popover с вариантами
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" className={className} variant="outline">
          <Share2 className="mr-2 h-4 w-4" />
          Поделиться
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Поделиться ссылкой на товар</p>

          <div className="grid grid-cols-2 gap-2">
            <a href={whatsappHref} target="_blank" rel="noreferrer">
              <Button type="button" variant="ghost" className="w-full justify-start">
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp
              </Button>
            </a>
            <a href={telegramHref} target="_blank" rel="noreferrer">
              <Button type="button" variant="ghost" className="w-full justify-start">
                <Send className="mr-2 h-4 w-4" />
                Telegram
              </Button>
            </a>
            <a href={facebookHref} target="_blank" rel="noreferrer">
              <Button type="button" variant="ghost" className="w-full justify-start">
                <Facebook className="mr-2 h-4 w-4" />
                Facebook
              </Button>
            </a>
            <a href={xHref} target="_blank" rel="noreferrer">
              <Button type="button" variant="ghost" className="w-full justify-start">
                <Twitter className="mr-2 h-4 w-4" />
                X (Twitter)
              </Button>
            </a>
            <a href={mailHref}>
              <Button type="button" variant="ghost" className="w-full justify-start">
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Button>
            </a>
            <Button type="button" variant="ghost" className="w-full justify-start" onClick={copyLink}>
              {copied ? <Check className="mr-2 h-4 w-4" /> : <Clipboard className="mr-2 h-4 w-4" />}
              {copied ? "Скопировано" : "Скопировать"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}