import { BellRing, Scale, RefreshCw, PackageSearch } from "lucide-react";
import { staffOrders } from "@/lib/data/mock";
import { formatCurrency } from "@/lib/utils";

export default function StaffDashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4 py-6 sm:px-6">
      <section className="rounded-2xl border border-spruce-100 bg-white p-4 shadow-soft sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-slate-500">Mobile Picker Dashboard</p>
            <h1 className="text-2xl font-semibold">Store floor operations</h1>
          </div>
          <button className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white">
            <BellRing className="h-4 w-4" />
            Enable live alerts
          </button>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-2xl bg-white p-4 shadow-soft">
          <p className="text-xs text-slate-500">Incoming queue</p>
          <p className="text-2xl font-semibold">12</p>
        </article>
        <article className="rounded-2xl bg-white p-4 shadow-soft">
          <p className="text-xs text-slate-500">Picking now</p>
          <p className="text-2xl font-semibold">5</p>
        </article>
        <article className="rounded-2xl bg-white p-4 shadow-soft">
          <p className="text-xs text-slate-500">Stock alerts</p>
          <p className="text-2xl font-semibold">3</p>
        </article>
        <article className="rounded-2xl bg-white p-4 shadow-soft">
          <p className="text-xs text-slate-500">Avg pick time</p>
          <p className="text-2xl font-semibold">11m</p>
        </article>
      </section>

      <section className="space-y-3">
        {staffOrders.map((order) => (
          <article key={order.id} className="rounded-2xl border border-spruce-100 bg-white p-4 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs text-slate-500">{order.id}</p>
                <h2 className="font-semibold">{order.customerName}</h2>
                <p className="text-sm text-slate-600">{order.items} items • {formatCurrency(order.total)}</p>
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-spruce-100 px-2.5 py-1 font-semibold text-spruce-800">{order.status}</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold text-slate-600">ETA {order.eta}</span>
              </div>
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <button className="inline-flex items-center justify-center gap-1 rounded-xl border border-spruce-100 px-3 py-2 text-sm">
                <PackageSearch className="h-4 w-4" />
                Start picking
              </button>
              <button className="inline-flex items-center justify-center gap-1 rounded-xl border border-spruce-100 px-3 py-2 text-sm">
                <Scale className="h-4 w-4" />
                Weight adjust
              </button>
              <button className="inline-flex items-center justify-center gap-1 rounded-xl border border-spruce-100 px-3 py-2 text-sm">
                <RefreshCw className="h-4 w-4" />
                Inventory update
              </button>
            </div>

            {order.requiresWeightAdjustment ? (
              <div className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-700">
                Weight adjustment required for produce items before packing.
              </div>
            ) : null}
          </article>
        ))}
      </section>
    </div>
  );
}
