import { NextResponse } from "next/server";
import { getDeadlineItems } from "@/lib/data";

export function GET() {
  return NextResponse.json({
    data: getDeadlineItems().map((item) => ({
      conference_id: item.conference.id,
      conference_slug: item.conference.slug,
      conference_title: item.conference.title,
      label: item.label,
      date: item.date,
      is_past: item.isPast,
    })),
  });
}
