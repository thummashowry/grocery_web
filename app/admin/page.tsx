import Link from "next/link";
import { Package, Tag, Users, AlertTriangle, TrendingUp } from "lucide-react";
import { getAllProducts, getAllCoupons, getAllEmployees, getAllStockAlerts } from "@/lib/data/queries";

export default async function AdminOverviewPage() {
  const [products, coupons, employees, stockDamageAlerts] = await Promise.all([
    getAllProducts(),
    getAllCoupons(),
    getAllEmployees(),
    getAllStockAlerts(),
  ]);

  const activeProducts = products.filter((p) => p.inStock).length;
  const activeCoupons = coupons.filter((c) => c.active).length;
  const activeEmployees = employees.filter((e) => e.active).length;
  const pendingAlerts = stockDamageAlerts.filter((a) => !a.notificationSent).length;

  const stats = [
    {
      label: "Total Products",
      value: products.length,
      sub: `${activeProducts} in stock`,
      icon: Package,
      href: "/admin/products",
      color: "bg-spruce-50 text-spruce-700"
    },
    {
      label: "Active Promotions",
      value: activeCoupons,
      sub: `${coupons.length} total coupons`,
      icon: Tag,
      href: "/admin/coupons",
      color: "bg-amber-50 text-amber-700"
    },
    {
      label: "Employees",
      value: employees.length,
      sub: `${activeEmployees} active`,
      icon: Users,
      href: "/admin/employees",
      color: "bg-blue-50 text-blue-700"
    },
    {
      label: "Stock Alerts",
      value: stockDamageAlerts.length,
      sub: `${pendingAlerts} unsent notifications`,
      icon: AlertTriangle,
      href: "/admin/stock",
      color: "bg-red-50 text-red-700"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-spruce-100 bg-white p-5 shadow-soft">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-6 w-6 text-spruce-600" />
          <div>
            <h1 className="text-xl font-semibold">Admin Overview</h1>
            <p className="text-sm text-slate-500">Manage your store operations from here.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group rounded-2xl border border-spruce-100 bg-white p-4 shadow-soft transition hover:border-spruce-300"
            >
              <div className={`mb-3 inline-flex rounded-xl p-2 ${stat.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold text-ink">{stat.value}</p>
              <p className="text-sm font-medium text-slate-700">{stat.label}</p>
              <p className="mt-0.5 text-xs text-slate-400">{stat.sub}</p>
            </Link>
          );
        })}
      </div>

      {/* Pending damage alerts banner */}
      {pendingAlerts > 0 && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div className="flex-1">
            <p className="font-semibold text-amber-800">
              {pendingAlerts} damage alert{pendingAlerts > 1 ? "s" : ""} need customer notification
            </p>
            <p className="mt-0.5 text-sm text-amber-700">
              Some orders contain items that were found damaged or out of stock during picking.
              Customers haven&apos;t been notified yet.
            </p>
          </div>
          <Link
            href="/admin/stock"
            className="shrink-0 rounded-xl bg-amber-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-amber-700"
          >
            Review
          </Link>
        </div>
      )}

      {/* Quick links */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/admin/products"
          className="flex items-center gap-3 rounded-2xl border border-spruce-100 bg-white p-4 shadow-soft transition hover:border-spruce-300"
        >
          <Package className="h-5 w-5 text-spruce-600" />
          <div>
            <p className="font-medium">Add New Product</p>
            <p className="text-xs text-slate-500">Register a product with stock & alternates</p>
          </div>
        </Link>
        <Link
          href="/admin/coupons"
          className="flex items-center gap-3 rounded-2xl border border-spruce-100 bg-white p-4 shadow-soft transition hover:border-spruce-300"
        >
          <Tag className="h-5 w-5 text-amber-600" />
          <div>
            <p className="font-medium">Create Promotion</p>
            <p className="text-xs text-slate-500">Set coupon codes or percentage discounts</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
