import {getUserSession} from '@/src/shared/server-lib/get-user-session';
import {loadCustomerAccount} from '@/src/shared/server-lib/customer-account';
import {CustomerAccount} from '@/src/shared/components/shared/customer-account';
import {redirect} from 'next/navigation';
export const dynamic='force-dynamic';
export default async function ProfilePage({params}:{params:Promise<{locale:string}>}) {
 const {locale}=await params;
 const session=await getUserSession();
 if(!session) redirect(`/${locale}/not-auth`);
 const account=await loadCustomerAccount(Number(session.id));
 if(!account) redirect(`/${locale}/not-auth`);
 return <CustomerAccount initial={account}/>;
}
