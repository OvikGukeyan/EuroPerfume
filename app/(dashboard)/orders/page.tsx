import { prisma } from "@/prisma/prisma-client"
import { OrdersTable } from "@/shared/components"

export default async function Orders() {
    const orders = await prisma.order.findMany()
    return (
        <div>
            <OrdersTable orders={orders}/>
        </div>
    )
}