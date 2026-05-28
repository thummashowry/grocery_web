import { test, expect } from "@playwright/test";

test.describe("Cart, checkout, tracking, and staff workflows", () => {
  test("cart shows summary and checkout CTA", async ({ page }) => {
    // Seed one item so the cart is not empty
    await page.addInitScript(() => {
      localStorage.setItem("hg_cart", JSON.stringify([{ productId: "p1", quantity: 1 }]));
    });
    await page.goto("/cart");

    await expect(page.getByRole("heading", { name: /order summary/i })).toBeVisible();
    await expect(page.getByText(/delivery fee estimate/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /proceed to checkout/i })).toBeVisible();
  });

  test("checkout reflects real cart subtotal, not a hardcoded value", async ({ page }) => {
    // p1 × 2 = $8.40  |  + $4.99 delivery + $1.50 service = $14.89 total
    await page.addInitScript(() => {
      localStorage.setItem("hg_cart", JSON.stringify([{ productId: "p1", quantity: 2 }]));
    });
    await page.goto("/checkout");

    await expect(page.getByText("$8.40")).toBeVisible();   // real subtotal
    await expect(page.getByText("$14.89")).toBeVisible();  // real total
    await expect(page.getByText("$42.50")).not.toBeVisible(); // old hardcoded value must be gone
  });

  test("checkout supports step progression", async ({ page }) => {
    await page.goto("/checkout");

    const continueButton = page.getByRole("button", { name: /^continue$/i });
    await expect(continueButton).toBeVisible();

    await expect(page.getByPlaceholder(/full name/i)).toBeVisible();
    await continueButton.click();
    await expect(page.getByText(/today 6:00 - 8:00 pm/i)).toBeVisible();

    await continueButton.click();
    await expect(page.getByText(/card ending in 4821/i)).toBeVisible();

    await continueButton.click();
    await expect(page.getByText(/your order is ready for confirmation/i)).toBeVisible();
  });

  test("order tracking timeline and statuses are visible", async ({ page }) => {
    await page.goto("/orders/ORD-2845/tracking");

    await expect(page.getByRole("heading", { name: /real-time order tracking/i })).toBeVisible();
    await expect(page.getByText(/^pending$/i).first()).toBeVisible();
    await expect(page.getByText(/^picking$/i).first()).toBeVisible();
    await expect(page.getByText(/delivery eta/i)).toBeVisible();
    await expect(page.getByRole("heading", { name: /timeline/i })).toBeVisible();
  });

  test("staff dashboard exposes queue and picking actions", async ({ page }) => {
    await page.goto("/staff");

    await expect(page.getByRole("heading", { name: /store floor operations/i })).toBeVisible();
    await expect(page.getByText(/incoming queue/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /start picking/i }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /weight adjust/i }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /inventory update/i }).first()).toBeVisible();
  });
});
