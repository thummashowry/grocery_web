import { MapPin, Timer } from "lucide-react";
import { OrderTimeline } from "@/components/order-timeline";
import { trackingEvents } from "@/lib/data/mock";

const statusPills = ["Pending", "Picking", "Completed", "Delivered"];

export default async function TrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-5xl space-y-4 px-4 py-6 sm:px-6">
      <section className="rounded-2xl border border-spruce-100 bg-white p-5 shadow-soft">
        <p className="text-xs font-medium text-slate-500">Order ID: {id}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Real-time order tracking</h1>

        <div className="mt-4 flex flex-wrap gap-2">
          {statusPills.map((status, index) => (
            <span
              key={status}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${index < 3 ? "bg-spruce-100 text-spruce-800" : "bg-slate-100 text-slate-500"}`}
            >
              {status}
            </span>
          ))}
        </div>

        <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          <div className="rounded-xl bg-spruce-50 p-3">
            <p className="inline-flex items-center gap-1 text-slate-500">
              <Timer className="h-4 w-4" />
              Delivery ETA
            </p>
            <p className="font-semibold">35-45 min</p>
          </div>

          <div className="rounded-xl bg-spruce-50 p-3">
            <p className="inline-flex items-center gap-1 text-slate-500">
              <MapPin className="h-4 w-4" />
              Courier location
            </p>
            <p className="font-semibold">2.1 miles away</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-spruce-100 bg-white p-5 shadow-soft">
        <h2 className="mb-4 text-lg font-semibold">Timeline</h2>
        <OrderTimeline events={trackingEvents} />
      </section>
    </div>
  );
}
