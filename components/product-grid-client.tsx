"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { SkeletonCard } from "@/components/skeleton-card";
import { type Product } from "@/types/product";

const PAGE_SIZE = 4;

type ProductGridClientProps = {
  products: Product[];
};

export function ProductGridClient({ products }: ProductGridClientProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const targetRef = useRef<HTMLDivElement | null>(null);

  const visibleProducts = useMemo(() => products.slice(0, visibleCount), [products, visibleCount]);
  const hasMore = visibleCount < products.length;

  useEffect(() => {
    if (!targetRef.current || !hasMore) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        setLoading(true);
        window.setTimeout(() => {
          setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, products.length));
          setLoading(false);
        }, 450);
      },
      { rootMargin: "120px" }
    );

    observer.observe(targetRef.current);
    return () => observer.disconnect();
  }, [hasMore, products.length]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div ref={targetRef} className="min-h-10">
        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : null}

        {!hasMore ? <p className="text-center text-sm text-slate-500">You have reached the end of the catalog.</p> : null}
      </div>
    </div>
  );
}
