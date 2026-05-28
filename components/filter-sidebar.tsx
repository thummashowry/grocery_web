"use client";

import { SlidersHorizontal } from "lucide-react";

const filters = ["Organic", "Vegan", "Gluten-Free", "Dairy-Free"];

export function FilterSidebar() {
  return (
    <aside className="sticky top-24 hidden h-fit rounded-2xl border border-spruce-100 bg-white p-4 shadow-soft lg:block">
      <div className="mb-4 flex items-center gap-2">
        <SlidersHorizontal className="h-4 w-4 text-spruce-700" />
        <h3 className="font-semibold text-ink">Filters</h3>
      </div>

      <div className="space-y-3">
        {filters.map((filter) => (
          <label key={filter} className="flex items-center justify-between rounded-xl p-2 text-sm hover:bg-spruce-50">
            <span>{filter}</span>
            <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-spruce-600" />
          </label>
        ))}
      </div>
    </aside>
  );
}
