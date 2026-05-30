"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, MapPin, Bell, ShieldCheck, LogOut, User } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export function SiteHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-spruce-100/60 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:flex-nowrap sm:px-6">
        <Link href="/" className="flex min-w-fit items-center gap-2 text-ink">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-spruce-500 text-sm font-bold text-white shadow-soft">
            HY
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold">Hybrid Grocer</p>
            <p className="text-xs text-slate-500">Store + Delivery</p>
          </div>
        </Link>

        <div className="relative order-last w-full sm:order-none sm:max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="h-11 w-full rounded-2xl border border-spruce-100 bg-slate-50 pl-9 pr-3 text-sm outline-none transition focus:border-spruce-300 focus:bg-white"
            placeholder="Search produce, pantry, bakery..."
            aria-label="Search groceries"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button className="grid h-10 w-10 place-items-center rounded-2xl border border-spruce-100 text-slate-600 transition hover:border-spruce-300 hover:text-spruce-700">
            <MapPin className="h-4 w-4" />
          </button>
          <button className="grid h-10 w-10 place-items-center rounded-2xl border border-spruce-100 text-slate-600 transition hover:border-spruce-300 hover:text-spruce-700">
            <Bell className="h-4 w-4" />
          </button>

          {user ? (
            <div className="hidden items-center gap-2 sm:flex">
              {(user.role === "admin" || user.role === "staff") && (
                <Link
                  href={user.role === "admin" ? "/admin" : "/staff"}
                  className="flex items-center gap-1.5 rounded-2xl border border-spruce-100 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-spruce-300 hover:text-spruce-700"
                >
                  <ShieldCheck className="h-4 w-4" />
                  {user.role === "admin" ? "Admin" : "Staff"}
                </Link>
              )}
              <div className="group relative">
                <button className="flex items-center gap-2 rounded-2xl border border-spruce-100 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-spruce-300">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-spruce-100 text-xs font-bold text-spruce-700">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="max-w-[120px] truncate">{user.name}</span>
                </button>
                <div className="absolute right-0 top-full z-50 mt-1 hidden w-44 rounded-2xl border border-spruce-100 bg-white p-2 shadow-card group-focus-within:block group-hover:block">
                  <p className="truncate px-3 py-1 text-xs text-slate-400">{user.email}</p>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-600 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/login"
                className="flex items-center gap-1.5 rounded-2xl border border-spruce-100 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-spruce-300 hover:text-spruce-700"
              >
                <User className="h-4 w-4" />
                Sign in
              </Link>
              <Link
                href="/admin/login"
                className="flex items-center gap-1.5 rounded-2xl border border-spruce-100 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-spruce-300 hover:text-spruce-700"
              >
                <ShieldCheck className="h-4 w-4" />
                Admin
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
