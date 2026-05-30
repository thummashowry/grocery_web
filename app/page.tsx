import Image from "next/image";
import Link from "next/link";
import { Clock3, Truck, Sparkles } from "lucide-react";
import { getAllCategories, getAllProducts, getPromoCards, getDeliverySlots } from "@/lib/data/queries";
import { PopularCarousel } from "@/components/popular-carousel";

export default async function HomePage() {
  const [categories, products, promoCards, deliverySlots] = await Promise.all([
    getAllCategories(),
    getAllProducts(),
    getPromoCards(),
    getDeliverySlots(),
  ]);
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6">
      <section className="animate-rise overflow-hidden rounded-3xl bg-white shadow-card">
        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div className="space-y-4">
            <p className="inline-flex items-center gap-2 rounded-full bg-spruce-100 px-3 py-1 text-xs font-semibold text-spruce-800">
              <Sparkles className="h-3.5 w-3.5" />
              Freshly stocked every hour
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl lg:text-5xl">
              Grocery quality you can feel in every delivery.
            </h1>
            <p className="max-w-xl text-sm text-slate-600 sm:text-base">
              Hybrid Grocer blends local in-store inventory with real-time online ordering, so your produce is picked fresh and delivered on your schedule.
            </p>
            <div className="flex gap-2">
              <Link href="/products" className="rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white">
                Shop groceries
              </Link>
              <button className="rounded-xl border border-spruce-200 px-5 py-3 text-sm font-semibold text-spruce-800">
                View delivery slots
              </button>
            </div>
          </div>

          <div className="relative h-72 overflow-hidden rounded-2xl sm:h-80">
            <Image
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80"
              alt="Fresh groceries"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-ink sm:text-xl">Featured categories</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((category) => (
            <button key={category.name} className="group overflow-hidden rounded-2xl bg-white shadow-soft transition hover:-translate-y-1">
              <div className="relative h-24 sm:h-28">
                <Image
                  src={`${category.imageUrl}?auto=format&fit=crop&w=500&q=70`}
                  alt={category.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-110"
                />
              </div>
              <p className="p-3 text-sm font-semibold text-ink">{category.name}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        {promoCards.map((promo) => (
          <article key={promo.title} className="rounded-2xl border border-spruce-100 bg-white p-5 shadow-soft">
            <p className="text-xs font-medium text-spruce-700">Limited promotion</p>
            <h3 className="mt-1 text-lg font-semibold text-ink">{promo.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{promo.subtitle}</p>
            <button className="mt-4 rounded-xl bg-spruce-600 px-4 py-2 text-sm font-semibold text-white">{promo.cta}</button>
          </article>
        ))}
      </section>

      <PopularCarousel items={products.slice(0, 4)} />

      <section className="rounded-2xl border border-spruce-100 bg-white p-5 shadow-soft">
        <div className="mb-4 flex items-center gap-2">
          <Truck className="h-4 w-4 text-spruce-700" />
          <h2 className="text-lg font-semibold">Delivery slot availability</h2>
        </div>

        <div className="grid gap-2 sm:grid-cols-3">
          {deliverySlots.map((slot) => (
            <article key={slot.id} className="rounded-xl border border-spruce-100 p-3">
              <p className="text-sm font-semibold text-ink">{slot.label}</p>
              <p className="mt-1 inline-flex items-center gap-1 text-xs text-slate-500">
                <Clock3 className="h-3.5 w-3.5" />
                {slot.capacity}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
