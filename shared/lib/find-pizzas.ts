import { prisma } from '@/prisma/prisma-client';

export interface GetSearchParams {
    query?: string;
    sortBy?: string;
    sizes?: string;
    pizzaTypes?: string;
    ingredients?: string;
    priceFrom?: string;
    priceTo?: string;
}

const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 50;
export const findPizzas = async (params: GetSearchParams) => {
    const sizes = params.sizes?.split(',').map(Number);
    const pizzaTypes = params.pizzaTypes?.split(',').map(Number);
    const ingredientsArr = params.ingredients?.split(',').map(Number);

    const priceFrom = Number(params.priceFrom) || DEFAULT_MIN_PRICE;
    const priceTo = Number(params.priceTo) || DEFAULT_MAX_PRICE;

    const categoryes = await prisma.category.findMany({
        include: {
            products: {
                orderBy: {
                    id: 'desc'
                },
                where: {
                    ingredients: ingredientsArr ? {
                        some: {
                            id: {
                                in: ingredientsArr
                            }
                        }
                    } : undefined,
                    items: {
                        some: {
                            size: { in: sizes },
                            pizzaType: { in: pizzaTypes },
                            price: { gte: priceFrom, lte: priceTo }
                        },
                    },
                },
                include: {
                    ingredients: true,
                    items: {
                        where: {
                            price: {
                                gte: priceFrom,
                                lte: priceTo
                            }
                        },
                        orderBy: {
                            price: 'asc'
                        }
                    }
                }
            }
        }
    });

    return categoryes;
}