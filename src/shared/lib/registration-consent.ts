import {z} from 'zod';
export const CONSENT_REVISION='2026-11-17';
export const consentCopy={
 ru:{terms:'Я принимаю условия EURO PERFUME (AGB).',privacy:'С информацией об обработке персональных данных можно ознакомиться в политике конфиденциальности. Данные аккаунта используются для его создания и обслуживания, а также обработки заказов.',marketing:'Я хочу получать от EURO PERFUME по email новости об ароматах, новинках и скидках и согласен на использование моего email для этой рассылки. Подписка добровольная. Я могу в любое время отозвать согласие через ссылку в письме или в личном кабинете, без ущерба для законности обработки до отзыва.'},
 de:{terms:'Ich akzeptiere die AGB von EURO PERFUME.',privacy:'Informationen zur Verarbeitung personenbezogener Daten findest du in der Datenschutzerklärung. Kontodaten werden zur Einrichtung und Verwaltung des Kundenkontos sowie zur Abwicklung von Bestellungen verarbeitet.',marketing:'Ich möchte von EURO PERFUME per E-Mail über Düfte, Neuheiten und Angebote informiert werden und willige in die Nutzung meiner E-Mail-Adresse für diesen Newsletter ein. Die Anmeldung ist freiwillig. Ich kann meine Einwilligung jederzeit über den Abmeldelink in einer E-Mail oder in meinem Kundenkonto mit Wirkung für die Zukunft widerrufen; die Rechtmäßigkeit der bisherigen Verarbeitung bleibt unberührt.'}
};
export function registrationSchema(locale:string){const ru=locale==='ru';return z.object({
 email:z.string().trim().email(ru?'Введите корректный email.':'Bitte eine gültige E-Mail-Adresse eingeben.').max(254).transform(s=>s.toLowerCase()),
 fullName:z.string().trim().min(2,ru?'Укажите имя и фамилию.':'Bitte Vor- und Nachname eingeben.').max(120),
 password:z.string().min(10,ru?'Пароль должен содержать минимум 10 символов.':'Das Passwort muss mindestens 10 Zeichen enthalten.').max(72),
 confirmPassword:z.string(),
 acceptPolicy:z.boolean().refine(v=>v===true,{message:ru?'Примите условия, чтобы зарегистрироваться.':'Bitte die AGB akzeptieren, um dich zu registrieren.'}),
 marketingOptIn:z.boolean().default(false),locale:z.enum(['ru','de'])
}).refine(v=>v.password===v.confirmPassword,{message:ru?'Пароли не совпадают.':'Die Passwörter stimmen nicht überein.',path:['confirmPassword']});}
export type RegistrationInput=z.infer<ReturnType<typeof registrationSchema>>;
export function hasMarketingConsent(value:{marketingConfirmedAt:Date|string|null;marketingWithdrawnAt:Date|string|null}|null|undefined){return Boolean(value?.marketingConfirmedAt&&!value.marketingWithdrawnAt);}
