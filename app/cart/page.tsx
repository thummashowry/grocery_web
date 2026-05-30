"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import { type Product } from "@/types/product";

export default function CartPage() {
  const { items, add, update, remove, subtotal } = useCart();
  const delivery = 4.99;
  const [productCatalog, setProductCatalog] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products").then((r) => r.json()).then(setProductCatalog);
  }, []);

  const cartItems = items
    .map((entry) => {
      const product = productCatalog.find((p) => p.id === entry.productId);
      if (!product) return null;
      return { ...entry, product, total: entry.quantity * product.price };
    })
    .filter(Boolean);

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
        <p className="text-lg font-semibold text-ink">Your cart is empty</p>
        <p className="mt-2 text-sm text-slate-500">Browse products and add items to get started.</p>
        <Link href="/products" className="mt-6 inline-block rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white">
          Shop groceries
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_360px]">
      <section className="space-y-3">
        {cartItems.map((item) => (
          <article key={item!.product.id} className="flex gap-3 rounded-2xl border border-spruce-100 bg-white p-3 shadow-soft sm:p-4">
            <div className="relative h-24 w-24 overflow-hidden rounded-xl">
              <Image src={`${item!.product.image}?auto=format&fit=crop&w=400&q=70`} alt={item!.product.name} fill className="object-cover" />
            </div>

            <div className="flex flex-1 flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold">{item!.product.name}</p>
                  <p className="text-xs text-slate-500">{item!.product.weightLabel}</p>
                </div>
                <button
                  onClick={() => remove(item!.productId)}
                  aria-label="Remove item"
                  className="text-slate-400 transition hover:text-rose-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <div className="inline-flex items-center rounded-xl border border-spruce-100">
                  <button
                    onClick={() => update(item!.productId, item!.quantity - 1)}
                    className="px-3 py-2 text-sm hover:text-spruce-700"
                  >-</button>
                  <span className="px-3 py-2 text-sm font-semibold">{item!.quantity}</span>
                  <button
                    onClick={() => update(item!.productId, item!.quantity + 1)}
                    className="px-3 py-2 text-sm hover:text-spruce-700"
                  >+</button>
                </div>
                <p className="text-sm font-semibold text-spruce-800">{formatCurrency(item!.total)}</p>
              </div>
            </div>
          </article>
        ))}

        <article className="rounded-2xl border border-spruce-100 bg-white p-4 shadow-soft">
          <h2 className="text-sm font-semibold">Suggested add-ons</h2>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {productCatalog.slice(0, 3).map((product) => (
              <button
                key={product.id}
                onClick={() => add(product.id)}
                className="rounded-xl border border-spruce-100 p-2 text-left text-xs hover:bg-spruce-50"
              >
                <p className="font-semibold">{product.name}</p>
                <p className="text-slate-500">{formatCurrency(product.price)}</p>
              </button>
            ))}
          </div>
        </article>
      </section>

      <aside className="sticky top-24 h-fit rounded-2xl border border-spruce-100 bg-white p-5 shadow-card">
        <h2 className="text-lg font-semibold">Order summary</h2>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Delivery fee estimate</span>
            <span>{formatCurrency(delivery)}</span>
          </div>
          <div className="flex justify-between border-t border-spruce-100 pt-2 font-semibold">
            <span>Total</span>
            <span>{formatCurrency(subtotal + delivery)}</span>
          </div>
        </div>

        <Link href="/checkout" className="mt-5 block rounded-xl bg-ink px-4 py-3 text-center text-sm font-semibold text-white">
          Proceed to checkout
        </Link>
      </aside>
    </div>
  );
}
