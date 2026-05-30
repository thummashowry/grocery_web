"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, GitMerge, Check, X, Search, FolderPlus } from "lucide-react";
import { type Product, type ProductTag } from "@/types/product";
import { formatCurrency } from "@/lib/utils";

const UNITS = ["kg", "g", "pcs", "bottle"] as const;
const ALL_TAGS: ProductTag[] = ["Organic", "Vegan", "Gluten-Free", "Dairy-Free"];

const emptyForm = (firstCategory: string): Omit<Product, "id" | "slug" | "gallery"> => ({
  name: "",
  category: firstCategory,
  description: "",
  image: "",
  price: 0,
  unit: "kg",
  weightLabel: "",
  inStock: true,
  stockLevel: 0,
  bufferedStock: 0,
  tags: [],
  nutrition: { calories: "", protein: "", carbs: "", fat: "" },
  alternates: [],
  discount: undefined
});

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategoryInput, setNewCategoryInput] = useState("");
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(() => emptyForm("Fruits"));
  const [search, setSearch] = useState("");
  const [alternateSearch, setAlternateSearch] = useState("");

  // Load data from API on mount
  useEffect(() => {
    fetch("/api/products").then((r) => r.json()).then(setProducts);
    fetch("/api/categories").then((r) => r.json()).then((cats: { name: string }[]) =>
      setCategories(cats.map((c) => c.name))
    );
  }, []);

  async function addCategory() {
    const name = newCategoryInput.trim();
    if (!name || categories.includes(name)) return;
    await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setCategories((prev) => [...prev, name]);
    setNewCategoryInput("");
    setShowCategoryInput(false);
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  function openNew() {
    setForm(emptyForm(categories[0] ?? "Fruits"));
    setEditId(null);
    setShowForm(true);
  }

  function openEdit(p: Product) {
    setForm({
      name: p.name,
      category: p.category,
      description: p.description,
      image: p.image,
      price: p.price,
      unit: p.unit,
      weightLabel: p.weightLabel,
      inStock: p.inStock,
      stockLevel: p.stockLevel,
      bufferedStock: p.bufferedStock,
      tags: [...p.tags],
      nutrition: { ...p.nutrition },
      alternates: [...(p.alternates ?? [])],
      discount: p.discount
    });
    setEditId(p.id);
    setShowForm(true);
  }

  function handleDelete(id: string) {
    fetch(`/api/products/${id}`, { method: "DELETE" }).then(() =>
      setProducts((prev) => prev.filter((p) => p.id !== id))
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editId) {
      const updated = await fetch(`/api/products/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          slug: form.name.toLowerCase().replace(/\s+/g, "-"),
        }),
      }).then((r) => r.json());
      setProducts((prev) => prev.map((p) => (p.id === editId ? updated : p)));
    } else {
      const created = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          slug: form.name.toLowerCase().replace(/\s+/g, "-"),
          gallery: form.image ? [form.image] : [],
        }),
      }).then((r) => r.json());
      setProducts((prev) => [created, ...prev]);
    }
    setShowForm(false);
    setEditId(null);
  }

  function toggleTag(tag: ProductTag) {
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter((t) => t !== tag) : [...f.tags, tag]
    }));
  }

  function toggleAlternate(id: string) {
    setForm((f) => ({
      ...f,
      alternates: (f.alternates ?? []).includes(id)
        ? (f.alternates ?? []).filter((a) => a !== id)
        : [...(f.alternates ?? []), id]
    }));
  }

  const alternateOptions = products.filter(
    (p) =>
      p.id !== editId &&
      p.name.toLowerCase().includes(alternateSearch.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-spruce-100 bg-white p-5 shadow-soft">
        <div>
          <h1 className="text-xl font-semibold">Products</h1>
          <p className="text-sm text-slate-500">{products.length} total · manage catalogue, stock & alternates</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCategoryInput((v) => !v)}
            className="inline-flex items-center gap-2 rounded-xl border border-spruce-100 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-spruce-300"
          >
            <FolderPlus className="h-4 w-4" />
            Categories
          </button>
          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 rounded-xl bg-spruce-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-spruce-700"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Category manager */}
      {showCategoryInput && (
        <div className="rounded-2xl border border-spruce-100 bg-white p-4 shadow-soft">
          <p className="mb-3 text-sm font-semibold">Manage Categories</p>
          <div className="mb-3 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center gap-1.5 rounded-full border border-spruce-100 px-3 py-1 text-sm"
              >
                {cat}
                <button
                  type="button"
                  onClick={() =>
                    setCategories((prev) => prev.filter((c) => c !== cat))
                  }
                  className="text-slate-400 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={newCategoryInput}
              onChange={(e) => setNewCategoryInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCategory())}
              placeholder="New category name..."
              className="h-9 flex-1 rounded-xl border border-spruce-100 px-3 text-sm outline-none focus:border-spruce-300"
            />
            <button
              type="button"
              onClick={addCategory}
              className="rounded-xl bg-spruce-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-spruce-700"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="h-10 w-full rounded-xl border border-spruce-100 bg-white pl-9 pr-3 text-sm outline-none focus:border-spruce-300"
        />
      </div>

      {/* Product list */}
      <div className="space-y-2">
        {filtered.map((p) => (
          <article
            key={p.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-spruce-100 bg-white px-4 py-3 shadow-soft"
          >
            <div className="flex items-center gap-3">
              {p.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-12 w-12 rounded-xl object-cover"
                />
              )}
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{p.name}</p>
                  {p.discount != null && p.discount > 0 && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                      {p.discount}% off
                    </span>
                  )}
                  {!p.inStock && (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600">
                      Out of stock
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500">
                  {p.category} · {formatCurrency(p.price)}/{p.unit} · stock: {p.stockLevel}
                </p>
                {(p.alternates ?? []).length > 0 && (
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                    <GitMerge className="h-3 w-3" />
                    {(p.alternates ?? []).length} alternate(s) set
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => openEdit(p)}
                className="inline-flex items-center gap-1 rounded-xl border border-spruce-100 px-3 py-1.5 text-sm transition hover:border-spruce-300"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="inline-flex items-center gap-1 rounded-xl border border-red-100 px-3 py-1.5 text-sm text-red-600 transition hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </article>
        ))}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-400">No products match your search.</p>
        )}
      </div>

      {/* Add / Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 px-4 py-8">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {editId ? "Edit Product" : "Add New Product"}
              </h2>
              <button type="button" onClick={() => setShowForm(false)}>
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Name */}
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Name *</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="h-10 w-full rounded-xl border border-spruce-100 px-3 text-sm outline-none focus:border-spruce-300"
                  placeholder="e.g. Cherry Tomatoes"
                />
              </div>

              {/* Category + Unit */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, category: e.target.value }))
                    }
                    className="h-10 w-full rounded-xl border border-spruce-100 px-3 text-sm outline-none focus:border-spruce-300"
                  >
                    {categories.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-slate-400">
                    Use the &ldquo;Categories&rdquo; button to add new ones.
                  </p>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Unit</label>
                  <select
                    value={form.unit}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, unit: e.target.value as Product["unit"] }))
                    }
                    className="h-10 w-full rounded-xl border border-spruce-100 px-3 text-sm outline-none focus:border-spruce-300"
                  >
                    {UNITS.map((u) => (
                      <option key={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price + Weight */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Price (€) *</label>
                  <input
                    required
                    type="number"
                    min={0}
                    step={0.01}
                    value={form.price}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, price: parseFloat(e.target.value) || 0 }))
                    }
                    className="h-10 w-full rounded-xl border border-spruce-100 px-3 text-sm outline-none focus:border-spruce-300"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Weight label</label>
                  <input
                    value={form.weightLabel}
                    onChange={(e) => setForm((f) => ({ ...f, weightLabel: e.target.value }))}
                    className="h-10 w-full rounded-xl border border-spruce-100 px-3 text-sm outline-none focus:border-spruce-300"
                    placeholder="e.g. 250g bag"
                  />
                </div>
              </div>

              {/* Stock + Buffered + Discount */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Stock level</label>
                  <input
                    type="number"
                    min={0}
                    value={form.stockLevel}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        stockLevel: parseInt(e.target.value) || 0,
                        inStock: (parseInt(e.target.value) || 0) > 0
                      }))
                    }
                    className="h-10 w-full rounded-xl border border-spruce-100 px-3 text-sm outline-none focus:border-spruce-300"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Buffer stock</label>
                  <input
                    type="number"
                    min={0}
                    value={form.bufferedStock}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        bufferedStock: parseInt(e.target.value) || 0
                      }))
                    }
                    className="h-10 w-full rounded-xl border border-spruce-100 px-3 text-sm outline-none focus:border-spruce-300"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Discount %</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={form.discount ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        discount: e.target.value === "" ? undefined : parseInt(e.target.value)
                      }))
                    }
                    placeholder="0"
                    className="h-10 w-full rounded-xl border border-spruce-100 px-3 text-sm outline-none focus:border-spruce-300"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Description</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full rounded-xl border border-spruce-100 px-3 py-2 text-sm outline-none focus:border-spruce-300"
                  placeholder="Brief product description"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Image URL</label>
                <input
                  value={form.image}
                  onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                  className="h-10 w-full rounded-xl border border-spruce-100 px-3 text-sm outline-none focus:border-spruce-300"
                  placeholder="https://..."
                />
              </div>

              {/* Tags */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-600">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition ${
                        form.tags.includes(tag)
                          ? "bg-spruce-600 text-white"
                          : "border border-spruce-100 text-slate-600 hover:border-spruce-300"
                      }`}
                    >
                      {form.tags.includes(tag) && <Check className="h-3 w-3" />}
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Alternates */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-600">
                  Alternate substitutes
                  <span className="ml-1 font-normal text-slate-400">
                    (shown to customers when item is out of stock)
                  </span>
                </label>
                <div className="relative mb-2">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input
                    value={alternateSearch}
                    onChange={(e) => setAlternateSearch(e.target.value)}
                    placeholder="Search products to add as alternates..."
                    className="h-9 w-full rounded-xl border border-spruce-100 pl-8 pr-3 text-xs outline-none focus:border-spruce-300"
                  />
                </div>
                <div className="max-h-32 overflow-y-auto rounded-xl border border-spruce-100">
                  {alternateOptions.map((p) => (
                    <label
                      key={p.id}
                      className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50"
                    >
                      <input
                        type="checkbox"
                        checked={(form.alternates ?? []).includes(p.id)}
                        onChange={() => toggleAlternate(p.id)}
                        className="accent-spruce-600"
                      />
                      {p.name}
                      <span className="ml-auto text-xs text-slate-400">{p.category}</span>
                    </label>
                  ))}
                  {alternateOptions.length === 0 && (
                    <p className="px-3 py-2 text-xs text-slate-400">No products found.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-xl border border-spruce-100 px-4 py-2 text-sm font-medium transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-spruce-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-spruce-700"
              >
                {editId ? "Save Changes" : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
