import { prisma } from "@/prisma/prisma-client"
import { OrdersTable } from "@/shared/components"

export default async function Orders() {
    const orders = await prisma.order.findMany({
        include: {
            items: true
        }
    })
    return (
        <div>
            <OrdersTable orders={orders}/>
        </div>
    )
}