"use client";

import { useCart } from "@/lib/cart-context";

export function AddToCartButton({ productId, inStock }: { productId: string; inStock: boolean }) {
  const { add } = useCart();
  return (
    <button
      onClick={() => add(productId)}
      disabled={!inStock}
      className="mt-5 w-full rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:bg-slate-300"
    >
      {inStock ? "Add to cart" : "Out of stock"}
    </button>
  );
}
