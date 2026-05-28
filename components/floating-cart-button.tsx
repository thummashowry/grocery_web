import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export function FloatingCartButton() {
  return (
    <Link
      href="/cart"
      className="fixed bottom-24 right-4 z-40 flex items-center gap-2 rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white shadow-card transition hover:-translate-y-0.5 md:bottom-6"
    >
      <ShoppingBag className="h-4 w-4" />
      Cart
      <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs">3</span>
    </Link>
  );
}
