import Image from "next/image";
import { notFound } from "next/navigation";
import { TagChip } from "@/components/tag-chip";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { getProductBySlug } from "@/lib/data/queries";
import { formatCurrency } from "@/lib/utils";

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const deliveryText = product.inStock ? "Delivered in 90-120 minutes" : "Back in stock tomorrow morning";

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
      <section className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-3">
          <div className="relative h-80 overflow-hidden rounded-3xl bg-white shadow-card sm:h-[440px]">
            <Image
              src={`${product.image}?auto=format&fit=crop&w=1200&q=80`}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            {product.gallery.map((img) => (
              <div key={img} className="relative h-24 overflow-hidden rounded-2xl bg-white shadow-soft">
                <Image src={`${img}?auto=format&fit=crop&w=500&q=70`} alt={product.name} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        <article className="rounded-3xl border border-spruce-100 bg-white p-5 shadow-soft sm:p-6">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{product.name}</h1>
          <p className="mt-2 text-sm text-slate-600">{product.description}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <TagChip key={tag} tag={tag} />
            ))}
          </div>

          <p className="mt-6 text-2xl font-semibold text-spruce-800">
            {formatCurrency(product.price)}/{product.unit}
          </p>

          <div className="mt-4 rounded-2xl bg-spruce-50 p-4 text-sm text-slate-700">
            <p className="font-semibold text-ink">Weight-based selector</p>
            <div className="mt-2 flex items-center gap-2">
              <button className="h-9 w-9 rounded-xl border border-spruce-200">-</button>
              <span className="rounded-xl bg-white px-4 py-2 font-medium">0.75 kg</span>
              <button className="h-9 w-9 rounded-xl border border-spruce-200">+</button>
            </div>
          </div>

          <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            <div className="rounded-xl border border-spruce-100 p-3">
              <p className="text-slate-500">Real-time stock</p>
              <p className="font-semibold text-ink">{product.stockLevel} units (buffer {product.bufferedStock})</p>
            </div>
            <div className="rounded-xl border border-spruce-100 p-3">
              <p className="text-slate-500">Delivery estimate</p>
              <p className="font-semibold text-ink">{deliveryText}</p>
            </div>
          </div>

          <AddToCartButton productId={product.id} inStock={product.inStock} />
        </article>
      </section>

      <section className="grid gap-3 rounded-2xl border border-spruce-100 bg-white p-5 shadow-soft sm:grid-cols-4">
        <h2 className="sm:col-span-4 text-lg font-semibold">Nutritional information</h2>
        <div className="rounded-xl bg-spruce-50 p-3 text-sm">
          <p className="text-slate-500">Calories</p>
          <p className="font-semibold">{product.nutrition.calories}</p>
        </div>
        <div className="rounded-xl bg-spruce-50 p-3 text-sm">
          <p className="text-slate-500">Protein</p>
          <p className="font-semibold">{product.nutrition.protein}</p>
        </div>
        <div className="rounded-xl bg-spruce-50 p-3 text-sm">
          <p className="text-slate-500">Carbs</p>
          <p className="font-semibold">{product.nutrition.carbs}</p>
        </div>
        <div className="rounded-xl bg-spruce-50 p-3 text-sm">
          <p className="text-slate-500">Fat</p>
          <p className="font-semibold">{product.nutrition.fat}</p>
        </div>
      </section>
    </div>
  );
}
