import Link from "next/link";
import { Search, MapPin, Bell } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-spruce-100/60 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:flex-nowrap sm:px-6">
        <Link href="/" className="flex min-w-fit items-center gap-2 text-ink">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-spruce-500 text-sm font-bold text-white shadow-soft">
            HY
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold">Hybrid Grocer</p>
            <p className="text-xs text-slate-500">Store + Delivery</p>
          </div>
        </Link>

        <div className="relative order-last w-full sm:order-none sm:max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="h-11 w-full rounded-2xl border border-spruce-100 bg-slate-50 pl-9 pr-3 text-sm outline-none transition focus:border-spruce-300 focus:bg-white"
            placeholder="Search produce, pantry, bakery..."
            aria-label="Search groceries"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button className="grid h-10 w-10 place-items-center rounded-2xl border border-spruce-100 text-slate-600 transition hover:border-spruce-300 hover:text-spruce-700">
            <MapPin className="h-4 w-4" />
          </button>
          <button className="grid h-10 w-10 place-items-center rounded-2xl border border-spruce-100 text-slate-600 transition hover:border-spruce-300 hover:text-spruce-700">
            <Bell className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
