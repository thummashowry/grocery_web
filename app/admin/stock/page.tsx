"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, Bell, BellOff, Plus, Package, X, CheckCircle2 } from "lucide-react";
import { type StockDamageAlert } from "@/types/admin";
import { type Product } from "@/types/product";
import { formatCurrency } from "@/lib/utils";

const emptyAlert = (): Omit<StockDamageAlert, "id" | "createdAt" | "notificationSent"> => ({
  productId: "",
  productName: "",
  quantityDamaged: 1,
  reason: "",
  affectedOrderIds: []
});

export default function AdminStockPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [alerts, setAlerts] = useState<StockDamageAlert[]>([]);
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [alertForm, setAlertForm] = useState(emptyAlert());
  const [orderIdsInput, setOrderIdsInput] = useState("");

  // Inline stock editing
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [stockValue, setStockValue] = useState(0);

  useEffect(() => {
    fetch("/api/products").then((r) => r.json()).then(setProducts);
    fetch("/api/stock-alerts").then((r) => r.json()).then(setAlerts);
  }, []);

  function startStockEdit(p: Product) {
    setEditingStockId(p.id);
    setStockValue(p.stockLevel);
  }

  function saveStockEdit(id: string) {
    const inStock = stockValue > 0;
    fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stockLevel: stockValue, inStock }),
    }).then(() =>
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, stockLevel: stockValue, inStock } : p))
      )
    );
    setEditingStockId(null);
  }

  function markNotificationSent(id: string) {
    fetch(`/api/stock-alerts/${id}`, { method: "PATCH" }).then(() =>
      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, notificationSent: true } : a))
      )
    );
  }

  function dismissAlert(id: string) {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }

  async function handleAlertSubmit(e: React.FormEvent) {
    e.preventDefault();
    const affectedOrderIds = orderIdsInput.split(",").map((s) => s.trim()).filter(Boolean);
    const created = await fetch("/api/stock-alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: alertForm.productId,
        quantityDamaged: alertForm.quantityDamaged,
        reason: alertForm.reason,
        affectedOrderIds,
      }),
    }).then((r) => r.json());

    // Deduct damaged quantity from local product state
    if (alertForm.productId) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === alertForm.productId
            ? {
                ...p,
                stockLevel: Math.max(0, p.stockLevel - alertForm.quantityDamaged),
                inStock: Math.max(0, p.stockLevel - alertForm.quantityDamaged) > 0
              }
            : p
        )
      );
    }
    setAlerts((prev) => [created, ...prev]);
    setShowAlertForm(false);
    setAlertForm(emptyAlert());
    setOrderIdsInput("");
  }

  const pendingAlerts = alerts.filter((a) => !a.notificationSent);
  const lowStockProducts = products.filter(
    (p) => p.stockLevel > 0 && p.stockLevel <= p.bufferedStock
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-spruce-100 bg-white p-5 shadow-soft">
        <div>
          <h1 className="text-xl font-semibold">Stock & Damage Alerts</h1>
          <p className="text-sm text-slate-500">
            Update stock levels · log damage · notify customers
          </p>
        </div>
        <button
          onClick={() => { setAlertForm(emptyAlert()); setOrderIdsInput(""); setShowAlertForm(true); }}
          className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          <AlertTriangle className="h-4 w-4" />
          Log Damage
        </button>
      </div>

      {/* Pending alerts banner */}
      {pendingAlerts.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center gap-2 text-amber-800">
            <Bell className="h-5 w-5" />
            <p className="font-semibold">
              {pendingAlerts.length} customer notification{pendingAlerts.length > 1 ? "s" : ""} pending
            </p>
          </div>
          <p className="mt-1 text-sm text-amber-700">
            The following orders contain items found damaged during picking. Customers should be
            informed and offered alternates.
          </p>
        </div>
      )}

      {/* Damage alerts */}
      {alerts.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-semibold text-slate-600">Damage / Out-of-stock alerts</h2>
          <div className="space-y-2">
            {alerts.map((alert) => {
              const product = products.find((p) => p.id === alert.productId);
              const alternates = (product?.alternates ?? [])
                .map((id) => products.find((p) => p.id === id))
                .filter(Boolean) as Product[];

              return (
                <article
                  key={alert.id}
                  className={`rounded-2xl border p-4 shadow-soft ${
                    alert.notificationSent
                      ? "border-spruce-100 bg-white opacity-70"
                      : "border-amber-200 bg-amber-50"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <AlertTriangle
                        className={`mt-0.5 h-5 w-5 shrink-0 ${
                          alert.notificationSent ? "text-slate-400" : "text-amber-600"
                        }`}
                      />
                      <div>
                        <p className="font-semibold">{alert.productName}</p>
                        <p className="text-sm text-slate-600">
                          {alert.quantityDamaged} unit{alert.quantityDamaged > 1 ? "s" : ""} damaged · {alert.reason}
                        </p>
                        {alert.affectedOrderIds.length > 0 && (
                          <p className="mt-1 text-xs text-slate-500">
                            Affected orders:{" "}
                            {alert.affectedOrderIds.map((id) => (
                              <span
                                key={id}
                                className="mr-1 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs"
                              >
                                {id}
                              </span>
                            ))}
                          </p>
                        )}
                        {alternates.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-medium text-slate-500">Suggested alternates for customers:</p>
                            <div className="mt-1 flex flex-wrap gap-1.5">
                              {alternates.map((alt) => (
                                <span
                                  key={alt.id}
                                  className="rounded-full bg-spruce-100 px-2 py-0.5 text-xs font-medium text-spruce-700"
                                >
                                  {alt.name} · {formatCurrency(alt.price)}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        <p className="mt-1 text-xs text-slate-400">
                          Logged {new Date(alert.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!alert.notificationSent ? (
                        <button
                          onClick={() => markNotificationSent(alert.id)}
                          className="inline-flex items-center gap-1 rounded-xl bg-amber-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-amber-700"
                        >
                          <Bell className="h-3.5 w-3.5" />
                          Mark notified
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-xl bg-spruce-100 px-3 py-1.5 text-sm font-medium text-spruce-700">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Notified
                        </span>
                      )}
                      <button
                        onClick={() => dismissAlert(alert.id)}
                        className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm text-slate-500 transition hover:bg-slate-50"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* Low stock warning */}
      {lowStockProducts.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-semibold text-slate-600">
            Low stock (at or below buffer level)
          </h2>
          <div className="space-y-2">
            {lowStockProducts.map((p) => (
              <article
                key={p.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-amber-100 bg-white px-4 py-3 shadow-soft"
              >
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-amber-600" />
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-slate-500">
                      Stock: {p.stockLevel} · Buffer: {p.bufferedStock}
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                  Low stock
                </span>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* All products stock table */}
      <section>
        <h2 className="mb-2 text-sm font-semibold text-slate-600">All products — stock levels</h2>
        <div className="overflow-hidden rounded-2xl border border-spruce-100 bg-white shadow-soft">
          <table className="w-full text-sm">
            <thead className="border-b border-spruce-100 bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Product</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">Stock</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">Buffer</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-spruce-50">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-right">
                    {editingStockId === p.id ? (
                      <input
                        type="number"
                        min={0}
                        value={stockValue}
                        onChange={(e) => setStockValue(parseInt(e.target.value) || 0)}
                        className="w-20 rounded-lg border border-spruce-300 px-2 py-1 text-right text-sm outline-none"
                        autoFocus
                      />
                    ) : (
                      p.stockLevel
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-500">{p.bufferedStock}</td>
                  <td className="px-4 py-3 text-right">
                    {!p.inStock ? (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                        Out of stock
                      </span>
                    ) : p.stockLevel <= p.bufferedStock ? (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                        Low
                      </span>
                    ) : (
                      <span className="rounded-full bg-spruce-100 px-2 py-0.5 text-xs font-medium text-spruce-700">
                        OK
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {editingStockId === p.id ? (
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => saveStockEdit(p.id)}
                          className="rounded-lg bg-spruce-600 px-2 py-1 text-xs font-semibold text-white"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingStockId(null)}
                          className="rounded-lg border px-2 py-1 text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startStockEdit(p)}
                        className="rounded-lg border border-spruce-100 px-2 py-1 text-xs transition hover:border-spruce-300"
                      >
                        Update
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Log Damage Form Modal */}
      {showAlertForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <form
            onSubmit={handleAlertSubmit}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Log Stock Damage
              </h2>
              <button type="button" onClick={() => setShowAlertForm(false)}>
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Product *</label>
                <select
                  required
                  value={alertForm.productId}
                  onChange={(e) => {
                    const prod = products.find((p) => p.id === e.target.value);
                    setAlertForm((f) => ({
                      ...f,
                      productId: e.target.value,
                      productName: prod?.name ?? ""
                    }));
                  }}
                  className="h-10 w-full rounded-xl border border-spruce-100 px-3 text-sm outline-none focus:border-spruce-300"
                >
                  <option value="">Select product...</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (stock: {p.stockLevel})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Quantity damaged *</label>
                <input
                  required
                  type="number"
                  min={1}
                  value={alertForm.quantityDamaged}
                  onChange={(e) =>
                    setAlertForm((f) => ({
                      ...f,
                      quantityDamaged: parseInt(e.target.value) || 1
                    }))
                  }
                  className="h-10 w-full rounded-xl border border-spruce-100 px-3 text-sm outline-none focus:border-spruce-300"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Reason / cause *</label>
                <textarea
                  required
                  rows={2}
                  value={alertForm.reason}
                  onChange={(e) =>
                    setAlertForm((f) => ({ ...f, reason: e.target.value }))
                  }
                  placeholder="e.g. Refrigeration failure, delivery damage..."
                  className="w-full rounded-xl border border-spruce-100 px-3 py-2 text-sm outline-none focus:border-spruce-300"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Affected order IDs
                  <span className="ml-1 font-normal text-slate-400">(comma-separated)</span>
                </label>
                <input
                  value={orderIdsInput}
                  onChange={(e) => setOrderIdsInput(e.target.value)}
                  placeholder="ORD-2841, ORD-2842"
                  className="h-10 w-full rounded-xl border border-spruce-100 px-3 text-sm outline-none focus:border-spruce-300"
                />
              </div>

              <div className="rounded-xl bg-blue-50 p-3 text-xs text-blue-700">
                Stock level will be automatically reduced by the damaged quantity.
                Customers with affected orders can then be notified with suggested alternates.
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAlertForm(false)}
                className="rounded-xl border border-spruce-100 px-4 py-2 text-sm font-medium transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Log Damage & Alert
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
