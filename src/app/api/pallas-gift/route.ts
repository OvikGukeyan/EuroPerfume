import {NextResponse} from "next/server";
import {getUserSession} from "@/src/shared/server-lib/get-user-session";
import {pallasGiftState} from "@/src/shared/server-lib/pallas-gift";
export const dynamic="force-dynamic";
export async function GET(){
 try {
  const session=await getUserSession();
  const state=await pallasGiftState(session?.email??null);
  return NextResponse.json({state},{headers:{"Cache-Control":"private, no-store"}});
 }catch{return NextResponse.json({state:"off"},{status:503,headers:{"Cache-Control":"private, no-store"}});}
}
