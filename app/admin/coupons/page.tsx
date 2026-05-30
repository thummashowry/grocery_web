"use client";

import { useState, useEffect } from "react";
import { Plus, Tag, Pencil, Trash2, X, ToggleLeft, ToggleRight } from "lucide-react";
import { type Coupon, type CouponType } from "@/types/admin";

const emptyForm = (): Omit<Coupon, "id" | "usageCount"> => ({
  code: "",
  type: "percentage",
  value: 10,
  minOrderAmount: 0,
  expiresAt: "",
  active: true,
  usageLimit: 100
});

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm());

  useEffect(() => {
    fetch("/api/coupons").then((r) => r.json()).then(setCoupons);
  }, []);

  function openNew() {
    setForm(emptyForm());
    setEditId(null);
    setShowForm(true);
  }

  function openEdit(c: Coupon) {
    setForm({
      code: c.code,
      type: c.type,
      value: c.value,
      minOrderAmount: c.minOrderAmount,
      expiresAt: c.expiresAt,
      active: c.active,
      usageLimit: c.usageLimit
    });
    setEditId(c.id);
    setShowForm(true);
  }

  function handleDelete(id: string) {
    fetch(`/api/coupons/${id}`, { method: "DELETE" }).then(() =>
      setCoupons((prev) => prev.filter((c) => c.id !== id))
    );
  }

  function toggleActive(id: string) {
    const coupon = coupons.find((c) => c.id === id);
    if (!coupon) return;
    fetch(`/api/coupons/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !coupon.active }),
    }).then(() =>
      setCoupons((prev) =>
        prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
      )
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editId) {
      const updated = await fetch(`/api/coupons/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }).then((r) => r.json());
      setCoupons((prev) => prev.map((c) => (c.id === editId ? updated : c)));
    } else {
      const created = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, code: form.code.toUpperCase().replace(/\s+/g, "") }),
      }).then((r) => r.json());
      setCoupons((prev) => [created, ...prev]);
    }
    setShowForm(false);
    setEditId(null);
  }

  const activeCoupons = coupons.filter((c) => c.active);
  const expiredCoupons = coupons.filter((c) => !c.active);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-spruce-100 bg-white p-5 shadow-soft">
        <div>
          <h1 className="text-xl font-semibold">Promotions & Coupons</h1>
          <p className="text-sm text-slate-500">
            {activeCoupons.length} active · create percentage or fixed-amount discounts
          </p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-xl bg-spruce-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-spruce-700"
        >
          <Plus className="h-4 w-4" />
          New Coupon
        </button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-spruce-100 bg-white p-4 shadow-soft">
          <p className="text-2xl font-bold">{coupons.length}</p>
          <p className="text-xs text-slate-500">Total coupons</p>
        </div>
        <div className="rounded-2xl border border-spruce-100 bg-white p-4 shadow-soft">
          <p className="text-2xl font-bold text-spruce-700">{activeCoupons.length}</p>
          <p className="text-xs text-slate-500">Active</p>
        </div>
        <div className="rounded-2xl border border-spruce-100 bg-white p-4 shadow-soft">
          <p className="text-2xl font-bold text-slate-400">{expiredCoupons.length}</p>
          <p className="text-xs text-slate-500">Inactive</p>
        </div>
      </div>

      {/* Coupon list */}
      <div className="space-y-2">
        {coupons.map((c) => (
          <article
            key={c.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-spruce-100 bg-white px-4 py-3 shadow-soft"
          >
            <div className="flex items-center gap-3">
              <div
                className={`inline-flex rounded-xl px-2 py-1 font-mono text-sm font-bold tracking-wide ${
                  c.active
                    ? "bg-spruce-100 text-spruce-800"
                    : "bg-slate-100 text-slate-400 line-through"
                }`}
              >
                {c.code}
              </div>
              <div>
                <p className="font-semibold">
                  {c.type === "percentage" ? `${c.value}% off` : `€${c.value.toFixed(2)} off`}
                  {c.minOrderAmount > 0 && (
                    <span className="ml-1 text-xs font-normal text-slate-500">
                      · min €{c.minOrderAmount}
                    </span>
                  )}
                </p>
                <p className="text-xs text-slate-400">
                  Expires {c.expiresAt} · {c.usageCount}/{c.usageLimit} used
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleActive(c.id)}
                className="text-slate-400 transition hover:text-spruce-600"
                title={c.active ? "Deactivate" : "Activate"}
              >
                {c.active ? (
                  <ToggleRight className="h-5 w-5 text-spruce-600" />
                ) : (
                  <ToggleLeft className="h-5 w-5" />
                )}
              </button>
              <button
                onClick={() => openEdit(c)}
                className="inline-flex items-center gap-1 rounded-xl border border-spruce-100 px-3 py-1.5 text-sm transition hover:border-spruce-300"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(c.id)}
                className="inline-flex items-center gap-1 rounded-xl border border-red-100 px-3 py-1.5 text-sm text-red-600 transition hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </article>
        ))}
        {coupons.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-400">No coupons yet. Create one above.</p>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <Tag className="h-5 w-5 text-spruce-600" />
                {editId ? "Edit Coupon" : "New Coupon"}
              </h2>
              <button type="button" onClick={() => setShowForm(false)}>
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Code */}
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Coupon code *</label>
                <input
                  required
                  value={form.code}
                  onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
                  placeholder="e.g. SUMMER20"
                  className="h-10 w-full rounded-xl border border-spruce-100 px-3 font-mono text-sm uppercase outline-none focus:border-spruce-300"
                />
              </div>

              {/* Type + Value */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Discount type</label>
                  <select
                    value={form.type}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, type: e.target.value as CouponType }))
                    }
                    className="h-10 w-full rounded-xl border border-spruce-100 px-3 text-sm outline-none focus:border-spruce-300"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed amount (€)</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">
                    {form.type === "percentage" ? "Percentage (0-100)" : "Amount (€)"}
                  </label>
                  <input
                    required
                    type="number"
                    min={0}
                    max={form.type === "percentage" ? 100 : undefined}
                    step={form.type === "percentage" ? 1 : 0.01}
                    value={form.value}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, value: parseFloat(e.target.value) || 0 }))
                    }
                    className="h-10 w-full rounded-xl border border-spruce-100 px-3 text-sm outline-none focus:border-spruce-300"
                  />
                </div>
              </div>

              {/* Min order + Usage limit */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Min. order (€)</label>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={form.minOrderAmount}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        minOrderAmount: parseFloat(e.target.value) || 0
                      }))
                    }
                    className="h-10 w-full rounded-xl border border-spruce-100 px-3 text-sm outline-none focus:border-spruce-300"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Usage limit</label>
                  <input
                    type="number"
                    min={1}
                    value={form.usageLimit}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        usageLimit: parseInt(e.target.value) || 1
                      }))
                    }
                    className="h-10 w-full rounded-xl border border-spruce-100 px-3 text-sm outline-none focus:border-spruce-300"
                  />
                </div>
              </div>

              {/* Expiry */}
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Expiry date *</label>
                <input
                  required
                  type="date"
                  value={form.expiresAt}
                  onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))}
                  className="h-10 w-full rounded-xl border border-spruce-100 px-3 text-sm outline-none focus:border-spruce-300"
                />
              </div>

              {/* Active toggle */}
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                  className="accent-spruce-600"
                />
                <span className="text-sm font-medium">Active (visible to customers)</span>
              </label>
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
                {editId ? "Save Changes" : "Create Coupon"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
