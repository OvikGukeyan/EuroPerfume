import { POST as addPromotion } from "../../promotions/[slug]/add/route";
import { NextRequest } from "next/server";
// Backward-compatible endpoint with the same server-side campaign attribution.
export async function POST(req:NextRequest) {
  return addPromotion(req,{params:Promise.resolve({slug:"wood-trio"})});
}
