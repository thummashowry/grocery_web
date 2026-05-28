"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, CircleAlert } from "lucide-react";
import { type Product } from "@/types/product";
import { TagChip } from "@/components/tag-chip";
import { cn, formatCurrency } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  return (
    <article className="group rounded-2xl border border-spruce-100 bg-white p-3 shadow-soft transition hover:-translate-y-1 hover:shadow-card">
      <Link href={`/products/${product.slug}`} className="block overflow-hidden rounded-xl">
        <Image
          src={`${product.image}?auto=format&fit=crop&w=720&q=80`}
          alt={product.name}
          width={600}
          height={420}
          className="h-40 w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="mt-3 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-ink">{product.name}</p>
            <p className="text-xs text-slate-500">{product.weightLabel}</p>
          </div>
          <p className="text-sm font-semibold text-spruce-800">{formatCurrency(product.price)}/{product.unit}</p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {product.tags.slice(0, 2).map((tag) => (
            <TagChip key={tag} tag={tag} />
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div
            className={cn(
              "inline-flex items-center gap-1 text-xs font-medium",
              product.inStock ? "text-emerald-700" : "text-rose-600"
            )}
          >
            <CircleAlert className="h-3.5 w-3.5" />
            {product.inStock ? `${product.stockLevel} in stock` : "Out of stock"}
          </div>

          <button
            onClick={() => add(product.id)}
            disabled={!product.inStock}
            className="inline-flex h-9 items-center gap-1 rounded-xl bg-spruce-600 px-3 text-xs font-semibold text-white transition hover:bg-spruce-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </button>
        </div>
      </div>
    </article>
  );
}
