import { CheckoutSteps } from "@/components/checkout-steps";
import { formatCurrency } from "@/lib/utils";

export default function CheckoutPage() {
  const subtotal = 42.5;
  const delivery = 4.99;
  const service = 1.5;

  return (
    <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_360px]">
      <CheckoutSteps />

      <aside className="sticky top-24 h-fit rounded-2xl border border-spruce-100 bg-white p-5 shadow-soft">
        <h2 className="text-lg font-semibold">Order summary</h2>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Delivery</span>
            <span>{formatCurrency(delivery)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Service</span>
            <span>{formatCurrency(service)}</span>
          </div>
          <div className="flex justify-between border-t border-spruce-100 pt-2 text-base font-semibold">
            <span>Total</span>
            <span>{formatCurrency(subtotal + delivery + service)}</span>
          </div>
        </div>

        <button className="mt-5 w-full rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white">Confirm order</button>
      </aside>
    </div>
  );
}
