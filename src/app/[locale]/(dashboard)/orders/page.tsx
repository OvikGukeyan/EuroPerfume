import { OrdersTable } from "@/src/shared/components";
import { DhlTestButton } from "@/src/shared/components/shared/dhlTest";

export default async function Orders() {

    return (
        <div>
            <OrdersTable/>
            <DhlTestButton/>
        </div>
    )
}