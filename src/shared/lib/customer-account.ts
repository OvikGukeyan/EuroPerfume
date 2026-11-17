export type AccountAddress = {id:string;fullName:string;street:string;houseNumber:string;city:string;postalCode:string;country:string;phone:string};
export type AccountOrder = {
 id:number;date:string;status:string;tracking:string|null;carrier:string;shipmentStatus:string|null;shippedAt:string|null;
 total:number;subtotal:number|null;shipping:number|null;discount:number|null;invoice:boolean;
 address:string;items:{id:number;name:string;image:string;amount:string;total:number|null}[];
};
export type AccountData = {fullName:string;email:string;provider:boolean;addresses:AccountAddress[];orders:AccountOrder[]};
export function deliveryStage(order:Pick<AccountOrder,'status'|'tracking'|'shipmentStatus'>) {
 if(order.status==='CENCELLED') return -1;
 if(order.shipmentStatus==='DELIVERED') return 3;
 if(order.tracking && order.shipmentStatus!=='CANCELED' && order.shipmentStatus!=='CREATED') return 2;
 return order.status==='SUCCEEDED'?1:0;
}
export function trackingUrl(carrier:string,tracking:string|null) {
 if(!tracking) return null;
 if(/dhl|ghl/i.test(carrier)) return `https://www.dhl.de/de/privatkunden/dhl-sendungsverfolgung.html?piececode=${encodeURIComponent(tracking)}`;
 return null;
}
export function demoAccount():AccountData {
 return {fullName:'Alex Beispiel',email:'alex@example.com',provider:false,addresses:[{id:'demo',fullName:'Alex Beispiel',street:'Musterstraße',houseNumber:'10',city:'Berlin',postalCode:'10115',country:'DEU',phone:''}],orders:[
 {id:10026,date:'2026-11-10T12:00:00Z',status:'SUCCEEDED',tracking:'DEMO-10026',carrier:'DHL',shipmentStatus:'IN_TRANSIT',shippedAt:'2026-11-11T12:00:00Z',total:69.95,subtotal:65,shipping:4.95,discount:0,invoice:false,address:'Alex Beispiel · Musterstraße 10 · 10115 Berlin · Deutschland',items:[{id:251,name:'Secret Parfum Box · 8 × 2 ml',image:'/assets/products/secret-parfum-box-8x2.webp',amount:'1 × 8 × 2 ml',total:65}]},
 {id:10012,date:'2026-10-20T12:00:00Z',status:'SUCCEEDED',tracking:null,carrier:'DHL',shipmentStatus:'DELIVERED',shippedAt:'2026-10-21T12:00:00Z',total:42,subtotal:37.05,shipping:4.95,discount:0,invoice:false,address:'Alex Beispiel · Musterstraße 10 · 10115 Berlin · Deutschland',items:[{id:251,name:'Discovery Box · 8 × 2 ml',image:'/discovery/box/closed-studio.jpg',amount:'1 × 8 × 2 ml',total:37.05}]}
 ]};
}
