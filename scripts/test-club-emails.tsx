import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createElement} from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {UserVerificationTemplate} from "../src/shared/components/shared/email-templates/user-verification";
import {PasswordResetTemplate} from "../src/shared/components/shared/email-templates/password-reset";
import {PayOrderTemplate} from "../src/shared/components/shared/email-templates/pay-order";
import {TrackingNotificationTemplate} from "../src/shared/components/shared/email-templates/tracking-notification-template";
import {OrderSuccessTemplate} from "../src/shared/components/shared/email-templates/order-success";
function checkGerman(label:string,html:string,phrases:string[]){
 for(const phrase of phrases)assert.ok(html.includes(phrase),`${label} missing ${phrase}`);
 assert.doesNotMatch(html,/[А-Яа-яЁёІіЇїЄє]/,`${label} contains Cyrillic`);
}
checkGerman("verification",renderToStaticMarkup(createElement(UserVerificationTemplate,{code:"TESTCODE",locale:"ru"})),["Bitte bestätige","E-Mail-Adresse"]);
checkGerman("password",renderToStaticMarkup(createElement(PasswordResetTemplate,{code:"TESTCODE"})),["Passwort zurücksetzen","Neues Passwort"]);
checkGerman("payment",renderToStaticMarkup(createElement(PayOrderTemplate,{orderId:99,totalAmount:40,paymentUrl:"https://example.invalid/pay"})),["Zahlung zu Bestellung","40"]);
checkGerman("tracking",renderToStaticMarkup(createElement(TrackingNotificationTemplate,{orderId:99,trackingNumber:"12345"})),["Versandinformationen","Sendungsverfolgung"]);
const pricing={version:1 as const,country:"DEU",capturedAt:"2026-11-21T12:00:00.000Z",policy:{mode:"exempt" as const,rateBasisPoints:0},subtotalGrossCents:6000,shippingGrossCents:0,discountGrossCents:600,loyaltyDiscountCents:500,totalGrossCents:4900,lines:[{productId:1,variationId:null,title:"Test Parfum",quantity:1,onTap:false,grossCents:6000}]};
checkGerman("order",renderToStaticMarkup(createElement(OrderSuccessTemplate,{orderId:99,orderDate:"21.11.2026",total:49,items:[],pricing})),["Bestelldetails","EURO PERFUME CLUB Punkte","49.00"]);
const source=(path:string)=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
assert.match(source("src/app/actions.ts"),/EURO PERFUME — Bitte E-Mail-Adresse bestätigen/);
assert.match(source("src/app/actions.ts"),/EURO PERFUME — Bestellbestätigung/);
assert.match(source("src/app/actions.ts"),/EURO PERFUME — Passwort zurücksetzen/);
assert.match(source("src/app/api/admin/marketing-campaigns/route.ts"),/const subject=campaign.subjectDe/);
assert.match(source("src/app/api/admin/marketing-campaigns/route.ts"),/const body=campaign.bodyDe/);
assert.match(source("src/shared/server-lib/registration-consent.tsx"),/const locale='de';const ru=false/);
assert.match(source("src/shared/server-lib/welcome-offer-mail.tsx"),/const ru=false,locale="de"/);
console.log("German customer email templates, campaign language and subjects: PASS (rendered/static, no emails sent).");
