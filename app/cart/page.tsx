import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/data/mock";
import { formatCurrency } from "@/lib/utils";

const cartItems = [
  { productId: "p1", quantity: 1.2, unit: "kg" },
  { productId: "p3", quantity: 0.8, unit: "kg" },
  { productId: "p4", quantity: 2, unit: "bottle" }
];

export default function CartPage() {
  const items = cartItems
    .map((entry) => {
      const product = products.find((item) => item.id === entry.productId);
      if (!product) {
        return null;
      }
      return {
        ...entry,
        product,
        total: entry.quantity * product.price
      };
    })
    .filter(Boolean);

  const subtotal = items.reduce((sum, item) => sum + item!.total, 0);
  const delivery = 4.99;

  return (
    <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_360px]">
      <section className="space-y-3">
        {items.map((item) => (
          <article key={item!.product.id} className="flex gap-3 rounded-2xl border border-spruce-100 bg-white p-3 shadow-soft sm:p-4">
            <div className="relative h-24 w-24 overflow-hidden rounded-xl">
              <Image src={`${item!.product.image}?auto=format&fit=crop&w=400&q=70`} alt={item!.product.name} fill className="object-cover" />
            </div>

            <div className="flex flex-1 flex-col justify-between">
              <div>
                <p className="text-sm font-semibold">{item!.product.name}</p>
                <p className="text-xs text-slate-500">Weight estimate: {item!.quantity} {item!.unit}</p>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <div className="inline-flex items-center rounded-xl border border-spruce-100">
                  <button className="px-3 py-2 text-sm">-</button>
                  <span className="px-3 py-2 text-sm font-semibold">{item!.quantity}</span>
                  <button className="px-3 py-2 text-sm">+</button>
                </div>
                <p className="text-sm font-semibold text-spruce-800">{formatCurrency(item!.total)}</p>
              </div>
            </div>
          </article>
        ))}

        <article className="rounded-2xl border border-spruce-100 bg-white p-4 shadow-soft">
          <h2 className="text-sm font-semibold">Suggested add-ons</h2>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {products.slice(0, 3).map((product) => (
              <button key={product.id} className="rounded-xl border border-spruce-100 p-2 text-left text-xs hover:bg-spruce-50">
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
