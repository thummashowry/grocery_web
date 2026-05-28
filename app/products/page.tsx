import { Search } from "lucide-react";
import { FilterSidebar } from "@/components/filter-sidebar";
import { ProductGridClient } from "@/components/product-grid-client";
import { products } from "@/lib/data/mock";

export default function ProductsPage() {
  return (
    <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:px-6 lg:grid-cols-[260px_1fr]">
      <FilterSidebar />

      <section className="space-y-4">
        <div className="rounded-2xl border border-spruce-100 bg-white p-3 shadow-soft sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                className="h-11 w-full rounded-xl border border-spruce-100 bg-slate-50 pl-9 pr-3 text-sm outline-none"
                placeholder="Search products"
              />
            </div>

            <select className="h-11 rounded-xl border border-spruce-100 px-3 text-sm">
              <option>Sort: Recommended</option>
              <option>Price: Low to high</option>
              <option>Price: High to low</option>
              <option>Newest</option>
            </select>
          </div>
        </div>

        <ProductGridClient products={products} />
      </section>
    </div>
  );
}
