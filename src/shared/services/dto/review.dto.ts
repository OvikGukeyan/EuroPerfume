import { Product, Review, User } from "@prisma/client";

export interface ReviewDTO extends Review {
    user: User;
    product: Product;
}