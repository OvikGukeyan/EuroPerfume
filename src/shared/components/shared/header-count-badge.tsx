import React from "react";

/** Shared cart/favorites counter. Both icons use the same geometry and brand colour. */
export function HeaderCountBadge({count}:{count:number}) {
  if (!Number.isFinite(count) || count <= 0) return null;
  return <span aria-hidden="true" className="header-count-badge absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#73534f] px-[3px] text-[10px] font-semibold leading-none tabular-nums text-white ring-2 ring-white sm:-right-1.5 sm:-top-1.5">
    {count > 99 ? "99+" : count}
  </span>;
}
