import { berlinOfferTime } from "./day-offer";

/** Calendar week in Europe/Berlin; ends are exclusive. Handles DST shifts. */
export function offerWeekSlots(now:Date = new Date()) {
  const parts=new Intl.DateTimeFormat("en-GB",{timeZone:"Europe/Berlin",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(now);
  const value=(key:string)=>Number(parts.find(p=>p.type===key)?.value);
  const local=new Date(Date.UTC(value("year"),value("month")-1,value("day")));
  const daysSinceMonday=(local.getUTCDay()+6)%7;
  const base=new Date(local.getTime()-daysSinceMonday*86400000);
  const midnight=(offset:number)=>{
    const date=new Date(base.getTime()+offset*86400000);
    const yyyy=date.getUTCFullYear(),mm=String(date.getUTCMonth()+1).padStart(2,"0"),dd=String(date.getUTCDate()).padStart(2,"0");
    return berlinOfferTime(`${yyyy}-${mm}-${dd}T00:00`);
  };
  const monday=midnight(0),nextMonday=midnight(7),followingMonday=midnight(14);
  return {current:{start:monday,end:nextMonday},next:{start:nextMonday,end:followingMonday}};
}
