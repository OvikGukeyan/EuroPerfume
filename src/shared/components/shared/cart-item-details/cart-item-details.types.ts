import { Brand } from "@prisma/client";

export interface CartItemProps {
  id: number;
  imageUrl: string;
  name: string;
  price: number;
  disabled?: boolean;
  quantity: number;
  brand: Brand;
  className?: string;
}
