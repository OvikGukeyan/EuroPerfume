import assert from "node:assert/strict";
import {test} from "node:test";
import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {readFileSync} from "node:fs";
import {PallasPromoNewsletter} from "../src/shared/components/shared/email-templates/pallas-promo-newsletter";
import {PALLAS_NEWSLETTER_MAX_RECIPIENTS,PALLAS_NEWSLETTER_SUBJECT} from "../src/shared/lib/pallas-promo-newsletter";

test("approved bilingual Pallas creative renders photo, both locales and individualized opt-out",()=>{
  const unsubscribeUrl="https://euro-perfume-inky.vercel.app/de/newsletter/leave?token=individualized-example";
  const html=renderToStaticMarkup(<PallasPromoNewsletter unsubscribeUrl={unsubscribeUrl}/>);
  assert.match(PALLAS_NEWSLETTER_SUBJECT,/Pallas Athene: 5 ml gratis \| 5 мл в подарок/);
  for(const token of [
    "Argos Pallas Athene", "5 мл в подарок к заказу от 100 €","5 ml gratis ab 100 € Warenwert",
    "Первые 10 покупателей", "Die ersten 10", "после скидок и баллов, без доставки",
    "nach Rabatten und Punkten, ohne Versand",
    'href="https://euro-perfume-inky.vercel.app/ru"', 'href="https://euro-perfume-inky.vercel.app/de"',
    'href="'+unsubscribeUrl+'"',"ARGOSPALLASATHENEPERFUMEBOTTLEFRONTVIEW100ML","Newsletter abbestellen","Impressum"
  ]) assert.ok(html.includes(token),token);
  assert.doesNotMatch(html,/data:image|15\s*%|BLACK15/);
});

test("one-time admin campaign fails closed, snapshots only approved audiences and claims queue atomically",()=>{
  const route=readFileSync("src/app/api/admin/marketing-campaigns/route.ts","utf8");
  const readiness=readFileSync("src/shared/server-lib/pallas-newsletter-promo-ready.ts","utf8");
  assert.equal(PALLAS_NEWSLETTER_MAX_RECIPIENTS,13);
  for(const token of [
    'admin.role!==UserRole.ADMIN', 'request.headers.get("origin")', 'take:PALLAS_NEWSLETTER_MAX_RECIPIENTS+1',
    'marketingConfirmedAt:{not:null,lte:cutoff},marketingWithdrawnAt:null',
    'deliveries:{create:recipients.map', 'status:"QUEUED"},data:{status:"SENDING"}',
    'marketingOptOutToken(user.id)', 'if(!current)throw new Error("CONSENT_WITHDRAWN")',
    'if(pallas&&!await pallasNewsletterPromoReady())'
  ])assert.ok(route.includes(token),token);
  for(const token of [
    'g.enabled','g."productId" = 295','g."lastSlot" < g.slots',
    'g."startsAt" <= now()', 'g."endsAt" > now()', 'catch {'
  ]) assert.ok(readiness.includes(token),token);
});
