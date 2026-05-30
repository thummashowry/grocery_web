"use client";

import { useState, useEffect } from "react";
import {
  BellRing,
  PackageSearch,
  Scale,
  RefreshCw,
  AlertTriangle,
  ChevronDown,
  Bell,
  CheckCircle2
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { type StaffOrder, type OrderStatus } from "@/types/order";
import { type StockDamageAlert } from "@/types/admin";
import { type Product } from "@/types/product";

type OrderItem = {
  id: number;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  unit: string;
  weightLabel: string;
  picked: boolean;
};

const STATUS_FLOW: OrderStatus[] = ["Pending", "Picking", "Completed", "Delivered"];

const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-slate-100 text-slate-700",
  Picking: "bg-amber-100 text-amber-700",
  Completed: "bg-spruce-100 text-spruce-700",
  Delivered: "bg-blue-100 text-blue-700",
  Cancelled: "bg-red-100 text-red-700",
  PartiallyFulfilled: "bg-purple-100 text-purple-700"
};

export default function StaffDashboardPage() {
  const [orders, setOrders] = useState<StaffOrder[]>([]);
  const [alerts, setAlerts] = useState<StockDamageAlert[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem[]>>({});

  useEffect(() => {
    fetch("/api/orders").then((r) => r.json()).then(setOrders);
    fetch("/api/stock-alerts").then((r) => r.json()).then((all: StockDamageAlert[]) =>
      setAlerts(all.filter((a) => !a.notificationSent))
    );
    fetch("/api/products").then((r) => r.json()).then(setProducts);
  }, []);

  const incoming = orders.filter((o) => o.status === "Pending").length;
  const picking = orders.filter((o) => o.status === "Picking").length;
  const stockAlerts = alerts.length;

  function advanceStatus(orderId: string) {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    const currentIdx = STATUS_FLOW.indexOf(order.status as (typeof STATUS_FLOW)[number]);
    const next = currentIdx < STATUS_FLOW.length - 1 ? STATUS_FLOW[currentIdx + 1] : order.status;
    fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    }).then(() =>
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: next } : o))
      )
    );
  }

  function markNotified(alertId: string) {
    fetch(`/api/stock-alerts/${alertId}`, { method: "PATCH" }).then(() =>
      setAlerts((prev) => prev.filter((a) => a.id !== alertId))
    );
  }

  function toggleExpand(orderId: string) {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
      return;
    }
    setExpandedOrder(orderId);
    if (!orderItems[orderId]) {
      fetch(`/api/orders/${orderId}/items`)
        .then((r) => r.json())
        .then((items: OrderItem[]) =>
          setOrderItems((prev) => ({ ...prev, [orderId]: items }))
        );
    }
  }

  function toggleItemPicked(orderId: string, itemId: number, current: boolean) {
    const next = !current;
    fetch(`/api/orders/${orderId}/items/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ picked: next }),
    }).then(() =>
      setOrderItems((prev) => ({
        ...prev,
        [orderId]: (prev[orderId] ?? []).map((i) =>
          i.id === itemId ? { ...i, picked: next } : i
        ),
      }))
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4 py-6 sm:px-6">
      {/* Header */}
      <section className="rounded-2xl border border-spruce-100 bg-white p-4 shadow-soft sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-slate-500">Mobile Picker Dashboard</p>
            <h1 className="text-2xl font-semibold">Store floor operations</h1>
          </div>
          <button className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white">
            <BellRing className="h-4 w-4" />
            Enable live alerts
          </button>
        </div>
      </section>

      {/* Stats */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-2xl bg-white p-4 shadow-soft">
          <p className="text-xs text-slate-500">Incoming queue</p>
          <p className="text-2xl font-semibold">{incoming}</p>
        </article>
        <article className="rounded-2xl bg-white p-4 shadow-soft">
          <p className="text-xs text-slate-500">Picking now</p>
          <p className="text-2xl font-semibold">{picking}</p>
        </article>
        <article className={`rounded-2xl p-4 shadow-soft ${stockAlerts > 0 ? "bg-amber-50" : "bg-white"}`}>
          <p className="text-xs text-slate-500">Stock alerts</p>
          <p className={`text-2xl font-semibold ${stockAlerts > 0 ? "text-amber-700" : ""}`}>
            {stockAlerts}
          </p>
        </article>
        <article className="rounded-2xl bg-white p-4 shadow-soft">
          <p className="text-xs text-slate-500">Avg pick time</p>
          <p className="text-2xl font-semibold">11m</p>
        </article>
      </section>

      {/* Damage / stock-out customer notifications */}
      {alerts.length > 0 && (
        <section>
          <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-700">
            <AlertTriangle className="h-4 w-4" />
            Customer notifications required — stock issue discovered during picking
          </h2>
          <div className="space-y-2">
            {alerts.map((alert) => {
              const product = products.find((p) => p.id === alert.productId);
              const alternates = (product?.alternates ?? [])
                .map((id) => products.find((p) => p.id === id))
                .filter(Boolean);

              return (
                <article
                  key={alert.id}
                  className="rounded-2xl border border-amber-200 bg-amber-50 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-amber-900">{alert.productName}</p>
                      <p className="text-sm text-amber-700">
                        {alert.quantityDamaged} unit{alert.quantityDamaged > 1 ? "s" : ""} damaged ·{" "}
                        {alert.reason}
                      </p>
                      {alert.affectedOrderIds.length > 0 && (
                        <p className="mt-1 text-xs text-amber-600">
                          Orders:{" "}
                          {alert.affectedOrderIds.map((id) => (
                            <span
                              key={id}
                              className="mr-1 rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs"
                            >
                              {id}
                            </span>
                          ))}
                        </p>
                      )}
                      {alternates.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-amber-700">
                            Suggest these alternates to customers:
                          </p>
                          <div className="mt-1 flex flex-wrap gap-1.5">
                            {alternates.map(
                              (alt) =>
                                alt && (
                                  <span
                                    key={alt.id}
                                    className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-spruce-700 ring-1 ring-spruce-200"
                                  >
                                    {alt.name} · {formatCurrency(alt.price)}
                                  </span>
                                )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => markNotified(alert.id)}
                      className="inline-flex items-center gap-1 rounded-xl bg-amber-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-amber-700"
                    >
                      <Bell className="h-3.5 w-3.5" />
                      Customer notified
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* Orders */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-600">Active orders</h2>
        {orders.map((order) => (
          <article key={order.id} className="rounded-2xl border border-spruce-100 bg-white p-4 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs text-slate-500">{order.id}</p>
                <h2 className="font-semibold">{order.customerName}</h2>
                <p className="text-sm text-slate-600">
                  {order.items} items · {formatCurrency(order.total)}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span
                  className={`rounded-full px-2.5 py-1 font-semibold ${
                    STATUS_COLORS[order.status] ?? "bg-slate-100 text-slate-700"
                  }`}
                >
                  {order.status}
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold text-slate-600">
                  ETA {order.eta}
                </span>

                {/* Advance status button */}
                {order.status !== "Delivered" && order.status !== "Cancelled" && (
                  <button
                    onClick={() => advanceStatus(order.id)}
                    className="inline-flex items-center gap-1 rounded-full bg-spruce-600 px-2.5 py-1 font-semibold text-white transition hover:bg-spruce-700"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    →{" "}
                    {
                      STATUS_FLOW[
                        STATUS_FLOW.indexOf(order.status as (typeof STATUS_FLOW)[number]) + 1
                      ]
                    }
                  </button>
                )}

                <button
                  onClick={() => toggleExpand(order.id)}
                  className="rounded-full bg-slate-100 p-1.5 text-slate-600"
                >
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition ${
                      expandedOrder === order.id ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
            </div>

            {expandedOrder === order.id && (
              <div className="mt-4 border-t border-spruce-100 pt-4">
                {/* Action buttons */}
                <div className="mb-3 grid gap-2 sm:grid-cols-3">
                  <button className="inline-flex items-center justify-center gap-1 rounded-xl border border-spruce-100 px-3 py-2 text-sm">
                    <PackageSearch className="h-4 w-4" />
                    Start picking
                  </button>
                  <button className="inline-flex items-center justify-center gap-1 rounded-xl border border-spruce-100 px-3 py-2 text-sm">
                    <Scale className="h-4 w-4" />
                    Weight adjust
                  </button>
                  <button className="inline-flex items-center justify-center gap-1 rounded-xl border border-spruce-100 px-3 py-2 text-sm">
                    <RefreshCw className="h-4 w-4" />
                    Inventory update
                  </button>
                </div>

                {/* Item picking list */}
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Picking list
                </p>
                {!orderItems[order.id] ? (
                  <p className="py-3 text-center text-sm text-slate-400">Loading…</p>
                ) : orderItems[order.id].length === 0 ? (
                  <p className="py-3 text-center text-sm text-slate-400">No items found.</p>
                ) : (
                  <div className="space-y-2">
                    {orderItems[order.id].map((item) => (
                      <label
                        key={item.id}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                          item.picked
                            ? "border-spruce-200 bg-spruce-50"
                            : "border-spruce-100 bg-white"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={item.picked}
                          onChange={() => toggleItemPicked(order.id, item.id, item.picked)}
                          className="h-4 w-4 accent-spruce-600"
                        />
                        {item.productImage && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={`${item.productImage}?auto=format&fit=crop&w=80&q=60`}
                            alt={item.productName}
                            className={`h-10 w-10 rounded-lg object-cover transition ${item.picked ? "opacity-40" : ""}`}
                          />
                        )}
                        <div className="flex-1">
                          <p className={`text-sm font-semibold ${item.picked ? "text-slate-400 line-through" : "text-ink"}`}>
                            {item.productName}
                          </p>
                          <p className="text-xs text-slate-500">
                            {item.quantity} {item.unit} · {item.weightLabel}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-spruce-700">
                          {formatCurrency(item.unitPrice * item.quantity)}
                        </p>
                      </label>
                    ))}
                    <p className="pt-1 text-right text-xs text-slate-400">
                      {orderItems[order.id].filter((i) => i.picked).length} of{" "}
                      {orderItems[order.id].length} items picked
                    </p>
                  </div>
                )}
              </div>
            )}

            {order.requiresWeightAdjustment && (
              <div className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-700">
                Weight adjustment required for produce items before packing.
              </div>
            )}
          </article>
        ))}
      </section>
    </div>
  );
}
