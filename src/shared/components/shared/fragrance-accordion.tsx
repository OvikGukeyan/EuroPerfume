import React from "react";
import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

export function FragranceAccordion({ title, children, id }: {
  title: string;
  children: ReactNode;
  id?: string;
}) {
  return <details className="fragrance-accordion" id={id}>
    <summary>
      <span>{title}</span>
      <ChevronDown size={18} strokeWidth={1.5} aria-hidden="true" />
    </summary>
    <div className="fragrance-accordion-content">{children}</div>
  </details>;
}
