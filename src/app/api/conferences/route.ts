import { NextResponse } from "next/server";
import { getUpcomingOrRecentConferences } from "@/lib/data";

export function GET() {
  return NextResponse.json({
    data: getUpcomingOrRecentConferences(),
    provenance_required: true,
  });
}
