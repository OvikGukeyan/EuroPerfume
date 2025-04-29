export interface CartItemProps {
  id: number;
  imageUrl: string;
  name: string;
  price: number;
  disabled?: boolean;
  quantity: number;
  className?: string;
}
