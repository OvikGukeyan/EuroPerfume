"use client";
import React from "react";
import {useAdminNotifications,type AdminCategory} from "./admin-notifications-context";
import {AdminNotificationBadge} from "./admin-notification-bell";
import {useLocale} from "next-intl";
import {cn} from "@/src/lib/utils";
import {Link,usePathname} from "@/src/i18n/navigation";
import {
 Sidebar,SidebarContent,SidebarFooter,SidebarGroup,SidebarGroupContent,SidebarGroupLabel,
 SidebarHeader,SidebarMenu,SidebarMenuButton,SidebarMenuItem
} from "../ui/sidebar";
import {House,Users,TicketPercent,Gift,Mail,ShoppingBag,Package,Truck,Layers,Plus,FlaskConical,Sparkles,FileText,Eye,Store,ChartNoAxesColumn} from "lucide-react";
type Props={className?:string};
type Item={ru:string;de:string;href:string;icon:typeof House};
export function AppSidebar({className}:Props){
 const ru=useLocale()==="ru",path=usePathname();
 const {counts,openInbox}=useAdminNotifications();
 const categoryByPath:Record<string,AdminCategory>={"/crm":"crm","/club":"club","/orders":"orders","/campaigns":"campaigns"};
 const groups:{ru:string;de:string;items:Item[]}[]=[
  {ru:"Главное",de:"Übersicht",items:[
   {ru:"Обзор магазина",de:"Shop-Übersicht",href:"/overview",icon:House}
  ]},
  {ru:"Клиенты и маркетинг",de:"Kunden & Marketing",items:[
   {ru:"Аналитика магазина",de:"Shop-Analysen",href:"/insights",icon:ChartNoAxesColumn},
   {ru:"Клиенты",de:"Kunden",href:"/crm",icon:Users},
   {ru:"Промокоды",de:"Gutscheincodes",href:"/create-promocode",icon:TicketPercent},
   {ru:"Бонусы и отправки",de:"Bonuspunkte",href:"/club",icon:Gift},
   {ru:"Email-рассылки",de:"Newsletter",href:"/campaigns",icon:Mail}
  ]},
  {ru:"Продажи и склад",de:"Verkauf & Lager",items:[
   {ru:"Заказы",de:"Bestellungen",href:"/orders",icon:ShoppingBag},
   {ru:"Поставка",de:"Wareneingang",href:"/supply",icon:Truck},
  ]},
  {ru:"Каталог и акции",de:"Katalog & Aktionen",items:[
   {ru:"Все товары",de:"Produkte",href:"/products",icon:Package},
   {ru:"Создать парфюм",de:"Parfum anlegen",href:"/create/1",icon:Plus},
   {ru:"Создать косметику",de:"Kosmetik anlegen",href:"/create/2",icon:Plus},
   {ru:"Создать другое",de:"Weitere Artikel anlegen",href:"/create/3",icon:Plus},
   {ru:"Подарочные акции",de:"Geschenkaktionen",href:"/promotions",icon:Gift},
   {ru:"Товар недели",de:"Duft der Woche",href:"/day-offer",icon:Sparkles},
   {ru:"Составы INCI",de:"Inhaltsstoffe",href:"/ingredients",icon:FlaskConical},
   {ru:"Слайды",de:"Slides",href:"/slides",icon:Layers},
   {ru:"Новый верхний слайд",de:"Oberes Slide anlegen",href:"/create-slide/1",icon:Plus},
   {ru:"Новый нижний слайд",de:"Unteres Slide anlegen",href:"/create-slide/2",icon:Plus}
  ]},
  {ru:"Просмотр и сайт",de:"Ansicht & Website",items:[
   {ru:"Кабинет клиента (демо)",de:"Kundenkonto (Vorschau)",href:"/account-preview",icon:Eye},
   {ru:"Мой кабинет",de:"Mein Konto",href:"/profile",icon:House},
   {ru:"Открыть магазин",de:"Shop öffnen",href:"/",icon:Store}
  ]}
 ];
 return <Sidebar collapsible="icon" className={cn("border-r border-[#e7e2df] bg-[#faf9f7]",className)}>
  <SidebarHeader className="border-b border-[#e7e2df] px-4 py-5">
   <p className="text-[11px] font-semibold uppercase tracking-[.17em]">EURO PERFUME</p>
   <p className="text-[10px] tracking-[.08em] text-[#8f766e]">{ru?"ПАНЕЛЬ УПРАВЛЕНИЯ":"VERWALTUNG"}</p>
  </SidebarHeader>
  <SidebarContent>
   {groups.map(group=><SidebarGroup key={group.de}>
    <SidebarGroupLabel className="text-[10px] uppercase tracking-[.13em] text-[#967c72]">{ru?group.ru:group.de}</SidebarGroupLabel>
    <SidebarGroupContent><SidebarMenu>
     {group.items.map(item=>{const Icon=item.icon;const active=path===item.href||(item.href!=="/"&&path.startsWith(item.href+"/"));
      return <SidebarMenuItem key={item.href} className="relative">
       <SidebarMenuButton asChild isActive={active} tooltip={ru?item.ru:item.de}>
        <Link href={item.href} className={cn("flex items-center gap-3 rounded-sm px-2 py-2 text-[13px] hover:bg-[#eee9e6]",active&&"bg-[#eee9e6] font-medium text-[#3e302c]")}>
         <Icon size={17} strokeWidth={1.7}/><span className="flex-1">{ru?item.ru:item.de}</span>
        </Link>
       </SidebarMenuButton>
       {categoryByPath[item.href]&&counts[categoryByPath[item.href]]>0&&<button type="button"
        aria-label={ru?`Открыть новые уведомления: ${item.ru}`:`Neue Meldungen öffnen: ${item.de}`}
        className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full p-0.5 hover:ring-2 hover:ring-[#dbc5bf]"
        onClick={()=>openInbox(categoryByPath[item.href])}>
         <AdminNotificationBadge count={counts[categoryByPath[item.href]]}/>
        </button>}
      </SidebarMenuItem>;
     })}
    </SidebarMenu></SidebarGroupContent>
   </SidebarGroup>)}
  </SidebarContent>
  <SidebarFooter className="border-t border-[#e7e2df] p-4">
   <span className="text-[10px] leading-5 text-neutral-500">{ru?"Отдельный магазин Vercel. Данные Shopify не используются.":"Eigenständiger Vercel-Shop. Keine Shopify-Daten."}</span>
  </SidebarFooter>
 </Sidebar>;
}
