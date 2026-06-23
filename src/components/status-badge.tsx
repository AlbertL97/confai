import { CheckCircle2, CircleAlert, CircleHelp } from "lucide-react";
import type { Conference } from "@/lib/schema";

const statusConfig = {
  high: {
    label: "High confidence",
    className: "border-emerald-200 bg-emerald-50 text-emerald-800",
    icon: CheckCircle2,
  },
  medium: {
    label: "Medium confidence",
    className: "border-amber-200 bg-amber-50 text-amber-800",
    icon: CircleHelp,
  },
  low: {
    label: "Needs review",
    className: "border-rose-200 bg-rose-50 text-rose-800",
    icon: CircleAlert,
  },
} as const;

export function ConfidenceBadge({
  confidence,
}: {
  confidence: Conference["source_confidence"];
}) {
  const config = statusConfig[confidence];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium ${config.className}`}
    >
      <Icon aria-hidden="true" className="size-3.5" />
      {config.label}
    </span>
  );
}
