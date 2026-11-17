import {Link} from '@/src/i18n/navigation';
import {UserRound} from 'lucide-react';
export default async function UnauthorizedPage({params}:{params:Promise<{locale:string}>}) {
 const {locale}=await params;const ru=locale==='ru';
 return <main className="mx-auto max-w-lg px-6 py-20 text-center"><UserRound className="mx-auto mb-6" size={42} strokeWidth={1.2}/><h1 className="text-3xl mb-5">{ru?'Вход в аккаунт':'Anmeldung'}</h1><p className="text-gray-500 leading-7 mb-8">{ru?'Чтобы открыть личный кабинет, нажмите «Войти» в верхней части сайта. После входа вы увидите свои заказы и личные данные. Если вы уже вошли, у вашей учётной записи нет доступа к этой странице.':'Um dein Kundenkonto zu öffnen, tippe oben auf „Anmelden“. Nach der Anmeldung siehst du deine Bestellungen und persönlichen Daten. Wenn du bereits angemeldet bist, hat dein Konto keinen Zugriff auf diese Seite.'}</p><Link href="/" className="inline-block rounded-md bg-neutral-800 text-white px-8 py-4">{ru?'На главную':'Zur Startseite'}</Link></main>;
}
