"use client";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { Gift, X } from "lucide-react";

export function DiscoveryBoxWidget() {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const de = useLocale() === "de";
  useEffect(()=>{
    const close=(e:MessageEvent)=>{
      if(e.origin===window.location.origin && e.data?.type==="close-discovery-box" && e.source===dialog.current?.querySelector("iframe")?.contentWindow) setOpen(false);
    };
    window.addEventListener("message",close);
    return ()=>window.removeEventListener("message",close);
  },[]);
  useEffect(() => {
    if (!open) return;
    dialog.current?.showModal();
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = old; };
  }, [open]);
  return <>
    <button type="button" onClick={() => setOpen(true)} aria-label={de ? "Discovery Box zusammenstellen" : "Подобрать аромабокс"} className="fixed bottom-4 right-4 z-30 flex h-11 items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 text-neutral-900 shadow-sm transition hover:bg-neutral-50 md:bottom-6 md:right-6">
      <Gift size={22} strokeWidth={1.3} aria-hidden="true" /><span className="text-[10px] leading-4 tracking-wide">DISCOVERY BOX</span><span className="hidden text-[9px] opacity-75 md:inline">8 × 2 ml</span>
    </button>
    {open && <dialog ref={dialog} onCancel={() => setOpen(false)} onClick={e => { if (e.target === e.currentTarget) setOpen(false); }} className="m-auto h-[92dvh] max-h-[92dvh] w-[96vw] max-w-[1200px] overflow-hidden rounded-xl border-0 p-0 shadow-2xl backdrop:bg-black/50">
      <div className="flex h-12 items-center justify-between border-b bg-white px-4"><span className="text-xs tracking-widest">EURO PERFUME · DISCOVERY BOX</span><button type="button" onClick={() => setOpen(false)} aria-label={de ? "Schließen" : "Закрыть"} className="flex h-11 w-11 items-center justify-center"><X size={20} /></button></div>
      <iframe title="EURO PERFUME Discovery Box" src="/discovery/index.html" style={{ height: "calc(100% - 3rem)" }} className="w-full border-0" />
    </dialog>}
  </>;
}
