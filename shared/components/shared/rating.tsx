import { cn } from "@/lib/utils";
import { MessageCircle } from "lucide-react";
import { FC } from "react";
import ReactStars from "react-stars";

interface Props {
    className?: string;
}
export const Rating: FC<Props> = ({className}) => (
  <div className={cn("w-full flex items-center justify-end gap-2", className)}>
    <ReactStars
      count={5}
      value={3.5}
      size={18}
      color2={"#111111"}
      color1={"#d8d8d8"}
      onChange={(newRating: any) => newRating}
    />
    <span>3.5</span>
    <div className="flex items-center gap-2">
      <span>( 3</span>
      <MessageCircle size={16} />
      <span>)</span>
    </div>
  </div>
);
