import type { ButtonHTMLAttributes } from "react";
import "./load-more-button.css";
export function LoadMoreButton({className = "", ...props}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" {...props} className={`store-load-more-button ${className}`} />;
}
