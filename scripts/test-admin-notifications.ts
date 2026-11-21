import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const get=(p:string)=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const sql=get("prisma/migrations/20261122013000_admin_notifications/migration.sql");
const api=get("src/app/api/admin/notifications/route.ts");
const ui=get("src/shared/components/shared/admin-notification-bell.tsx");
const state=get("src/shared/components/shared/admin-notifications-context.tsx");
const sidebar=get("src/shared/components/shared/app-sidebar.tsx");
const layout=get("src/app/[locale]/(dashboard)/layout.tsx");

for(const type of ["registered","email_verified","newsletter_requested","newsletter_confirmed","newsletter_unsubscribed","coupon_issued","coupon_email_sent","coupon_redeemed","new_order","refund_recorded","points_earned","points_spent"]){
 assert.ok(sql.includes(type),"No stored event for "+type);
 assert.ok(ui.includes(type),"No message for "+type);
}
for(const table of ['"User"','"AccountConsent"','"LegacyNewsletterReward"','"Order"','"CouponRedemption"','"LoyaltyEntry"','"InvoiceRefund"']){
 assert.ok(sql.includes('ON public.'+table),"No trigger on "+table);
}
assert.match(sql,/ENABLE ROW LEVEL SECURITY/g);
assert.match(sql,/REVOKE ALL ON public."AdminNotification",public."AdminNotificationSeen" FROM anon,authenticated/);
assert.match(sql,/UNIQUE/,"Event idempotency must rely on unique source key");
assert.match(sql,/PRIMARY KEY\("adminId","notificationId"\)/,"Unread state belongs to each admin");
assert.match(api,/UserRole.ADMIN/);
assert.match(api,/request.headers.get\("origin"\)/);
assert.match(api,/skipDuplicates:true/);
assert.match(api,/seen:\{none:\{adminId\}\}/);
assert.match(api,/take:100/);
assert.match(state,/setInterval/);
assert.match(state,/30000/);
assert.match(state,/openInbox/);
assert.match(state,/setPresented\(visible\)/);
assert.match(ui,/AdminNotificationBadge count=\{total\}/);
for(const href of ['"/crm":"crm"','"/club":"club"','"/orders":"orders"','"/campaigns":"campaigns"'])assert.ok(sidebar.includes(href));
assert.match(layout,/AdminNotificationsProvider/);
assert.match(layout,/AdminNotificationBell/);
console.log("Admin notification inbox: event coverage, role boundary, idempotency, badges, visibility polling, mark-seen policy PASS");
