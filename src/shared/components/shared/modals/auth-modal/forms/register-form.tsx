import React,{FC} from 'react';
import {FormProvider,useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useLocale} from 'next-intl';
import {FormInput,Title} from '../../..';
import toast from 'react-hot-toast';
import {signIn} from 'next-auth/react';
import {registerUser} from '@/src/app/actions';
import {Button} from '@/src/shared/components/ui';
import {Link} from '@/src/i18n/navigation';
import {registrationSchema,consentCopy,type RegistrationInput} from '@/src/shared/lib/registration-consent';
interface Props{onClose:VoidFunction;className?:string}
export const RegisterForm:FC<Props>=({onClose})=>{
 const locale=useLocale()==='ru'?'ru':'de';const ru=locale==='ru';const copy=consentCopy[locale];
 const form=useForm<RegistrationInput>({resolver:zodResolver(registrationSchema(locale)),defaultValues:{email:'',fullName:'',password:'',confirmPassword:'',acceptPolicy:false,marketingOptIn:false,locale}});
 async function onSubmit(data:RegistrationInput){try{
 const result=await registerUser({...data,locale});
 await signIn('credentials',{email:data.email,password:data.password,redirect:false});
 toast.success(ru?'Аккаунт создан. Подтвердите email по ссылке в письме.':'Konto erstellt. Bitte bestätige deine E-Mail-Adresse über den Link in der E-Mail.');
 if(data.marketingOptIn){if(result.marketingEmailSent)toast(ru?'Для рекламы нужно отдельное подтверждение: мы отправили второе письмо.':'Für den Newsletter ist eine separate Bestätigung nötig. Wir haben dir eine zweite E-Mail gesendet.');else toast(ru?'Подписка пока не активна. Письмо можно запросить повторно в личном кабинете.':'Der Newsletter ist noch nicht aktiv. Die Bestätigungs-E-Mail kannst du im Kundenkonto erneut anfordern.');}
 onClose();
 }catch{toast.error(ru?'Не удалось зарегистрироваться. Проверьте данные. Возможно, этот email уже зарегистрирован.':'Registrierung fehlgeschlagen. Bitte prüfe deine Angaben. Diese E-Mail-Adresse ist möglicherweise bereits registriert.');}}
 return <FormProvider {...form}><form className="flex flex-col gap-5" onSubmit={form.handleSubmit(onSubmit)}><div><Title text={ru?'Создать аккаунт':'Konto erstellen'} size="md" className="font-medium"/><p className="mt-2 text-sm text-stone-500">{ru?'Ваши заказы и любимые ароматы — в одном месте.':'Deine Bestellungen und Lieblingsdüfte an einem Ort.'}</p></div><FormInput name="email" label="E-Mail" required/><FormInput name="fullName" label={ru?'Имя и фамилия':'Vor- und Nachname'} required/><FormInput name="password" label={ru?'Пароль · минимум 10 символов':'Passwort · mindestens 10 Zeichen'} type="password" required/><FormInput name="confirmPassword" label={ru?'Повторите пароль':'Passwort wiederholen'} type="password" required/>
 <div className="rounded-lg border border-stone-200 p-4 text-sm leading-6"><div className="flex items-start gap-3"><input type="checkbox" id="registration-terms" {...form.register('acceptPolicy')} className="accent-stone-800 mt-1 h-4 w-4 shrink-0"/><label htmlFor="registration-terms">{ru?'Я принимаю':'Ich akzeptiere die'} <Link href="/agb" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{ru?'условия EURO PERFUME (AGB)':'AGB von EURO PERFUME'}</Link>. *</label></div>{form.formState.errors.acceptPolicy&&<p role="alert" className="text-red-700 mt-2">{form.formState.errors.acceptPolicy.message}</p>}<p className="mt-4 text-xs leading-5 text-stone-600">{copy.privacy} <Link href="/data-protection" target="_blank" rel="noopener noreferrer" className="underline">{ru?'Политика конфиденциальности':'Datenschutzerklärung'}</Link>.</p></div>
 <div className="rounded-lg bg-stone-50 p-4 text-sm leading-6"><div className="flex items-start gap-3"><input type="checkbox" id="registration-marketing" {...form.register('marketingOptIn')} className="accent-stone-800 mt-1 h-4 w-4 shrink-0"/><label htmlFor="registration-marketing"><span className="block font-medium mb-1">{ru?'Новости и предложения по email (необязательно)':'Neuheiten und Angebote per E-Mail (optional)'}</span>{copy.marketing}</label></div><p className="mt-3 text-xs text-stone-600">{ru?'Отдельное подтверждение по email. Без подписки можно зарегистрироваться и делать заказы.':'Separate Bestätigung per E-Mail. Registrierung und Bestellungen sind auch ohne Newsletter möglich.'}</p></div>
 <Button loading={form.formState.isSubmitting} className="h-12 text-base" type="submit">{ru?'Зарегистрироваться':'Registrieren'}</Button><p className="text-xs text-stone-500 leading-5">{ru?'Уведомления о заказах и доставке отправляются независимо от рекламной подписки.':'Bestell- und Versandnachrichten erhältst du unabhängig von der Newsletter-Anmeldung.'}</p></form></FormProvider>;
};
