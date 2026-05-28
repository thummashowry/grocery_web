import { type ProductTag } from "@/types/product";

const tagStyles: Record<ProductTag, string> = {
  Organic: "bg-emerald-50 text-emerald-700",
  Vegan: "bg-lime-50 text-lime-700",
  "Gluten-Free": "bg-amber-50 text-amber-700",
  "Dairy-Free": "bg-cyan-50 text-cyan-700"
};

export function TagChip({ tag }: { tag: ProductTag }) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${tagStyles[tag]}`}>{tag}</span>;
}
