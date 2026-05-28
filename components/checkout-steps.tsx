"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { deliverySlots } from "@/lib/data/mock";

const steps = ["Address", "Delivery", "Payment", "Review"];

export function CheckoutSteps() {
  const [step, setStep] = useState(0);

  return (
    <section className="space-y-5 rounded-2xl border border-spruce-100 bg-white p-4 shadow-soft sm:p-6">
      <div className="grid grid-cols-4 gap-2 text-center text-xs font-semibold">
        {steps.map((label, index) => (
          <button
            key={label}
            onClick={() => setStep(index)}
            className={`rounded-xl px-2 py-2 ${step === index ? "bg-spruce-600 text-white" : "bg-spruce-50 text-spruce-700"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {step === 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="rounded-xl border border-spruce-100 p-3 text-sm" placeholder="Full name" />
          <input className="rounded-xl border border-spruce-100 p-3 text-sm" placeholder="Phone" />
          <input className="rounded-xl border border-spruce-100 p-3 text-sm sm:col-span-2" placeholder="Street address" />
          <input className="rounded-xl border border-spruce-100 p-3 text-sm" placeholder="City" />
          <input className="rounded-xl border border-spruce-100 p-3 text-sm" placeholder="Postal code" />
        </div>
      ) : null}

      {step === 1 ? (
        <div className="space-y-2">
          {deliverySlots.map((slot) => (
            <label key={slot.id} className="flex items-center justify-between rounded-xl border border-spruce-100 p-3 text-sm">
              <span>{slot.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">{slot.capacity}</span>
                <input type="radio" name="slot" disabled={!slot.available} />
              </div>
            </label>
          ))}
        </div>
      ) : null}

      {step === 2 ? (
        <div className="grid gap-2 text-sm">
          <label className="rounded-xl border border-spruce-100 p-3">
            <input type="radio" name="payment" className="mr-2" defaultChecked />
            Card ending in 4821
          </label>
          <label className="rounded-xl border border-spruce-100 p-3">
            <input type="radio" name="payment" className="mr-2" />
            Apple Pay
          </label>
          <label className="rounded-xl border border-spruce-100 p-3">
            <input type="radio" name="payment" className="mr-2" />
            Cash on delivery
          </label>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="rounded-xl bg-spruce-50 p-4 text-sm text-slate-700">
          Your order is ready for confirmation. Delivery fee and weight adjustment will be finalized at packing.
        </div>
      ) : null}

      <div className="flex justify-end">
        <button
          onClick={() => setStep((prev) => Math.min(prev + 1, steps.length - 1))}
          className="inline-flex items-center gap-1 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white"
        >
          Continue
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
