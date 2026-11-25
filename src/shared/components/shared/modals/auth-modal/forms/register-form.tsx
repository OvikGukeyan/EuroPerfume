import React,{FC,useState} from 'react';
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
interface Props{onClose:VoidFunction;onCompleted:VoidFunction;className?:string}
export const RegisterForm:FC<Props>=({onClose,onCompleted})=>{
 const locale=useLocale()==='ru'?'ru':'de';const ru=locale==='ru';const copy=consentCopy[locale];
 const form=useForm<RegistrationInput>({resolver:zodResolver(registrationSchema(locale)),defaultValues:{email:'',fullName:'',password:'',confirmPassword:'',acceptPolicy:false,marketingOptIn:false,locale}});
 const [completion,setCompletion]=useState<{mailSent:boolean;marketing:boolean}|null>(null);
 async function onSubmit(data:RegistrationInput){try{
 const result=await registerUser({...data,locale});
 // The account has been created even when automatic sign-in is not yet possible.
 setCompletion({mailSent:result.accountEmailSent,marketing:data.marketingOptIn});
 onCompleted();
 await signIn('credentials',{email:data.email,password:data.password,redirect:false}).catch(()=>undefined);
 }catch{toast.error(ru?'Не удалось зарегистрироваться. Проверьте данные. Возможно, этот email уже зарегистрирован.':'Registrierung fehlgeschlagen. Bitte prüfe deine Angaben. Diese E-Mail-Adresse ist möglicherweise bereits registriert.');}}
 if(completion)return <div className="space-y-4">
  <section role="status" aria-live="polite" className="rounded-lg border border-stone-200 bg-stone-50 p-4 text-sm leading-6">
   <h2 className="text-lg font-medium">{ru?'Аккаунт создан':'Konto erstellt'}</h2>
   {completion.mailSent?<>
    <p className="mt-2 font-medium">{ru?'Остался один шаг: подтвердите email.':'Nur noch ein Schritt: Bestätige deine E-Mail-Adresse.'}</p>
    <p className="mt-2">{ru?'Откройте письмо от EURO PERFUME. Если его нет во «Входящих», проверьте «Промоакции» (Gmail) и «Спам».':'Öffne die E-Mail von EURO PERFUME. Wenn sie nicht im Posteingang ist, prüfe den Tab „Werbung“ (Gmail) und den Spamordner.'}</p>
    <p className="mt-2">{completion.marketing
     ?(ru?'Нажмите «Подтвердить email и подписку». Одно письмо подтверждает и аккаунт, и выбранную вами подписку.':'Klicke auf „E-Mail und Newsletter bestätigen“. Diese eine E-Mail bestätigt dein Konto und dein freiwillig ausgewähltes Newsletter-Abo.')
     :(ru?'Нажмите «Подтвердить email». Рекламная подписка не оформляется.':'Klicke auf „E-Mail-Adresse bestätigen“. Damit meldest du dich nicht zum Newsletter an.')}</p>
   </>:<p className="mt-2">{ru?'Письмо подтверждения не удалось отправить. Обратитесь в поддержку. Создавать аккаунт заново не нужно.':'Die Bestätigungs-E-Mail konnte nicht versendet werden. Bitte kontaktiere unseren Kundenservice. Du musst kein neues Konto erstellen.'}</p>}
  </section>
  <Button type="button" className="h-12 w-full" onClick={onClose}>{ru?'Понятно':'Verstanden'}</Button>
 </div>;
 return <FormProvider {...form}><form className="flex flex-col gap-5" onSubmit={form.handleSubmit(onSubmit)}><div><Title text={ru?'Создать аккаунт':'Konto erstellen'} size="md" className="font-medium"/><p className="mt-2 text-sm text-stone-500">{ru?'Ваши заказы и любимые ароматы — в одном месте.':'Deine Bestellungen und Lieblingsdüfte an einem Ort.'}</p></div><FormInput name="email" label="E-Mail" required/><FormInput name="fullName" label={ru?'Имя и фамилия':'Vor- und Nachname'} required/><FormInput name="password" label={ru?'Пароль · минимум 10 символов':'Passwort · mindestens 10 Zeichen'} type="password" required/><FormInput name="confirmPassword" label={ru?'Повторите пароль':'Passwort wiederholen'} type="password" required/>
 <div className="rounded-lg border border-stone-200 p-4 text-sm leading-6"><div className="flex items-start gap-3"><input type="checkbox" id="registration-terms" {...form.register('acceptPolicy')} className="accent-stone-800 mt-1 h-4 w-4 shrink-0"/><label htmlFor="registration-terms">{ru?'Я принимаю':'Ich akzeptiere die'} <Link href="/agb" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{ru?'условия EURO PERFUME (AGB)':'AGB von EURO PERFUME'}</Link>. *</label></div>{form.formState.errors.acceptPolicy&&<p role="alert" className="text-red-700 mt-2">{form.formState.errors.acceptPolicy.message}</p>}<p className="mt-4 text-xs leading-5 text-stone-600">{copy.privacy} <Link href="/data-protection" target="_blank" rel="noopener noreferrer" className="underline">{ru?'Политика конфиденциальности':'Datenschutzerklärung'}</Link>.</p></div>
 <div className="rounded-lg bg-stone-50 p-4 text-sm leading-6"><div className="flex items-start gap-3"><input type="checkbox" id="registration-marketing" {...form.register('marketingOptIn')} className="accent-stone-800 mt-1 h-4 w-4 shrink-0"/><label htmlFor="registration-marketing"><span className="block font-medium mb-1">{ru?'Новости и предложения по email (необязательно)':'Neuheiten und Angebote per E-Mail (optional)'}</span>{copy.marketing}</label></div><p className="mt-3 text-xs text-stone-600">{ru?'Если выбрали рассылку, одна ссылка подтвердит email аккаунта и выбранную подписку. Подписка не нужна для регистрации и заказов.':'Wenn du den Newsletter auswählst, bestätigt ein Link sowohl die E-Mail-Adresse deines Kontos als auch dein Abo. Registrierung und Bestellungen sind auch ohne Newsletter möglich.'}</p></div>
 <Button loading={form.formState.isSubmitting} className="h-12 text-base" type="submit">{ru?'Зарегистрироваться':'Registrieren'}</Button><p className="text-xs text-stone-500 leading-5">{ru?'Уведомления о заказах и доставке отправляются независимо от рекламной подписки.':'Bestell- und Versandnachrichten erhältst du unabhängig von der Newsletter-Anmeldung.'}</p></form></FormProvider>;
};
