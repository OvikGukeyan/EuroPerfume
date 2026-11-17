import {CustomerAccount} from '@/src/shared/components/shared/customer-account';
import {demoAccount} from '@/src/shared/lib/customer-account';
export const metadata={title:'EURO PERFUME · Account preview',robots:{index:false,follow:false}};
export default function AccountPreview(){return <CustomerAccount initial={demoAccount()} demo/>;}
