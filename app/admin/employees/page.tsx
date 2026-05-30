"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, UserCheck, UserX, ShieldCheck } from "lucide-react";
import { type Employee, type EmployeeRole } from "@/types/admin";

type EmployeeForm = Omit<Employee, "id"> & { password: string };

const emptyForm = (): EmployeeForm => ({
  name: "",
  email: "",
  role: "staff",
  active: true,
  joinedAt: new Date().toISOString().split("T")[0],
  password: ""
});

export default function AdminEmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<EmployeeForm>(emptyForm());
  const [filterRole, setFilterRole] = useState<"all" | EmployeeRole>("all");

  useEffect(() => {
    fetch("/api/employees").then((r) => r.json()).then(setEmployees);
  }, []);

  const filtered = employees.filter(
    (e) => filterRole === "all" || e.role === filterRole
  );

  function openNew() {
    setForm(emptyForm());
    setEditId(null);
    setShowForm(true);
  }

  function openEdit(emp: Employee) {
    setForm({
      name: emp.name,
      email: emp.email,
      role: emp.role,
      password: "",
      active: emp.active,
      joinedAt: emp.joinedAt
    });
    setEditId(emp.id);
    setShowForm(true);
  }

  function handleDelete(id: string) {
    fetch(`/api/employees/${id}`, { method: "DELETE" }).then(() =>
      setEmployees((prev) => prev.filter((e) => e.id !== id))
    );
  }

  function toggleActive(id: string) {
    const emp = employees.find((e) => e.id === id);
    if (!emp) return;
    fetch(`/api/employees/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !emp.active }),
    }).then(() =>
      setEmployees((prev) =>
        prev.map((e) => (e.id === id ? { ...e, active: !e.active } : e))
      )
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editId) {
      // Only send password if admin typed one
      const payload: Record<string, unknown> = { ...form };
      if (!form.password) delete payload.password;
      const updated = await fetch(`/api/employees/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).then((r) => r.json());
      setEmployees((prev) => prev.map((emp) => (emp.id === editId ? updated : emp)));
    } else {
      const created = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }).then((r) => r.json());
      setEmployees((prev) => [created, ...prev]);
    }
    setShowForm(false);
    setEditId(null);
  }

  const adminCount = employees.filter((e) => e.role === "admin").length;
  const staffCount = employees.filter((e) => e.role === "staff").length;
  const activeCount = employees.filter((e) => e.active).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-spruce-100 bg-white p-5 shadow-soft">
        <div>
          <h1 className="text-xl font-semibold">Employees</h1>
          <p className="text-sm text-slate-500">
            {employees.length} total · {activeCount} active
          </p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-xl bg-spruce-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-spruce-700"
        >
          <Plus className="h-4 w-4" />
          Add Employee
        </button>
      </div>

      {/* Stats + filter */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="grid flex-1 grid-cols-3 gap-3">
          <div className="rounded-2xl border border-spruce-100 bg-white p-3 shadow-soft">
            <p className="text-xl font-bold">{employees.length}</p>
            <p className="text-xs text-slate-500">Total</p>
          </div>
          <div className="rounded-2xl border border-spruce-100 bg-white p-3 shadow-soft">
            <p className="text-xl font-bold text-blue-700">{adminCount}</p>
            <p className="text-xs text-slate-500">Admins</p>
          </div>
          <div className="rounded-2xl border border-spruce-100 bg-white p-3 shadow-soft">
            <p className="text-xl font-bold text-spruce-700">{staffCount}</p>
            <p className="text-xs text-slate-500">Staff</p>
          </div>
        </div>

        <div className="flex gap-2">
          {(["all", "admin", "staff"] as const).map((role) => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`rounded-xl px-3 py-1.5 text-sm font-medium transition capitalize ${
                filterRole === role
                  ? "bg-spruce-600 text-white"
                  : "border border-spruce-100 text-slate-600 hover:border-spruce-300"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Employee list */}
      <div className="space-y-2">
        {filtered.map((emp) => (
          <article
            key={emp.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-spruce-100 bg-white px-4 py-3 shadow-soft"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-spruce-100 text-sm font-bold text-spruce-700">
                {emp.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{emp.name}</p>
                  {emp.role === "admin" && (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                      <ShieldCheck className="h-3 w-3" />
                      Admin
                    </span>
                  )}
                  {!emp.active && (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                      Inactive
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500">{emp.email}</p>
                <p className="text-xs text-slate-400">Joined {emp.joinedAt}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleActive(emp.id)}
                className="inline-flex items-center gap-1 rounded-xl border border-spruce-100 px-3 py-1.5 text-sm transition hover:border-spruce-300"
                title={emp.active ? "Deactivate" : "Activate"}
              >
                {emp.active ? (
                  <UserX className="h-3.5 w-3.5 text-slate-500" />
                ) : (
                  <UserCheck className="h-3.5 w-3.5 text-spruce-600" />
                )}
                {emp.active ? "Deactivate" : "Activate"}
              </button>
              <button
                onClick={() => openEdit(emp)}
                className="inline-flex items-center gap-1 rounded-xl border border-spruce-100 px-3 py-1.5 text-sm transition hover:border-spruce-300"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(emp.id)}
                className="inline-flex items-center gap-1 rounded-xl border border-red-100 px-3 py-1.5 text-sm text-red-600 transition hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </article>
        ))}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-400">No employees found.</p>
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
              <h2 className="text-lg font-semibold">
                {editId ? "Edit Employee" : "Add Employee"}
              </h2>
              <button type="button" onClick={() => setShowForm(false)}>
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Full name *</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="h-10 w-full rounded-xl border border-spruce-100 px-3 text-sm outline-none focus:border-spruce-300"
                  placeholder="e.g. Alex Rivera"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Email *</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="h-10 w-full rounded-xl border border-spruce-100 px-3 text-sm outline-none focus:border-spruce-300"
                  placeholder="alex@hybridgrocer.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Role</label>
                  <select
                    value={form.role}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, role: e.target.value as EmployeeRole }))
                    }
                    className="h-10 w-full rounded-xl border border-spruce-100 px-3 text-sm outline-none focus:border-spruce-300"
                  >
                    <option value="staff">Staff (picker)</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Join date</label>
                  <input
                    type="date"
                    value={form.joinedAt}
                    onChange={(e) => setForm((f) => ({ ...f, joinedAt: e.target.value }))}
                    className="h-10 w-full rounded-xl border border-spruce-100 px-3 text-sm outline-none focus:border-spruce-300"
                  />
                </div>
              </div>

              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                  className="accent-spruce-600"
                />
                <span className="text-sm font-medium">Active employee</span>
              </label>

              {/* Password — required for new employees, optional when editing */}
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  {editId ? "New password (leave blank to keep current)" : "Password *"}
                </label>
                <input
                  type="password"
                  required={!editId}
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className="h-10 w-full rounded-xl border border-spruce-100 px-3 text-sm outline-none focus:border-spruce-300"
                  placeholder={editId ? "Leave blank to keep current" : "Set login password"}
                />
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
                {editId ? "Save Changes" : "Add Employee"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
