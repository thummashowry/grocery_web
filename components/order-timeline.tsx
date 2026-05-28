import { CheckCircle2 } from "lucide-react";
import { type TrackingEvent } from "@/types/order";

export function OrderTimeline({ events }: { events: TrackingEvent[] }) {
  return (
    <ol className="space-y-5">
      {events.map((event, idx) => (
        <li key={event.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <CheckCircle2 className="h-5 w-5 text-spruce-600" />
            {idx !== events.length - 1 ? <span className="mt-1 h-12 w-px bg-spruce-100" /> : null}
          </div>

          <div className="rounded-2xl border border-spruce-100 bg-white p-3 shadow-soft">
            <p className="text-xs font-medium text-slate-500">{event.time}</p>
            <p className="mt-1 text-sm font-semibold text-ink">{event.status}</p>
            <p className="text-sm text-slate-600">{event.note}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
