import { cn } from "@/lib/utils";
import { MessageCircle } from "lucide-react";
import { FC } from "react";
import ReactStars from "react-stars";

interface Props {
  className?: string;
  value?: number
}
export const Rating: FC<Props> = ({ className, value }) => (
  <div className={cn("", className)}>
    <ReactStars
      count={5}
      value={value}
      size={18}
      color2={"#111111"}
      color1={"#d8d8d8"}
      onChange={(newRating: any) => newRating}
    />
  </div>
);
