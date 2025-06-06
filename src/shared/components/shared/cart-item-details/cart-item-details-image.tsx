import { cn } from "@/src/shared/lib/utils";
import Image from "next/image";
interface Props {
  src: string;
  className?: string;
}

export const CartItemDetailsImage: React.FC<Props> = ({ src, className }) => {
  return <Image alt="product" width={60} height={60} className={cn('w-[60px] h-[60px]', className)} src={src} />;
};
