import { ProductCard } from "@/components/product-card";
import { type Product } from "@/types/product";

export function PopularCarousel({ items }: { items: Product[] }) {
  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between">
        <h2 className="text-lg font-semibold text-ink sm:text-xl">Popular this week</h2>
        <button className="text-sm font-medium text-spruce-700">View all</button>
      </div>

      <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        <div className="flex w-max gap-3 sm:grid sm:w-full sm:grid-cols-2 lg:grid-cols-4">
          {items.map((product) => (
            <div key={product.id} className="w-72 sm:w-auto">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
