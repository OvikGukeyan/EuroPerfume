// SubmitPriceButton.tsx
"use client";

import { useFormStatus } from "react-dom";
import { ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/src/shared/components/ui/button";

export function SubmitPriceButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="icon" variant="ghost" disabled={pending} aria-busy={pending}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChevronRight size={20} />}
    </Button>
  );
}