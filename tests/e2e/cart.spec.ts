import { test, expect, type Page } from "@playwright/test";

/** Seed the cart in localStorage before the page loads */
async function seedCart(page: Page, items: { productId: string; quantity: number }[]) {
  await page.addInitScript((data) => {
    localStorage.setItem("hg_cart", JSON.stringify(data));
  }, items);
}

// Prices from DB — displayed as EUR via de-DE locale (e.g. "4,20 €")
// p1 Organic Hass Avocado      €4.20  → "4,20 €"
// p2 Wild Blueberries          €7.80  → "7,80 €"
// p3 Farm Baby Spinach         €5.90  → "5,90 €"
// p4 Unsweetened Almond Milk   €3.40  → "3,40 €"
// p5 Stoneground Sourdough     €6.80  → "6,80 €"  (out of stock)
// p6 Greek Yogurt 2%           €4.90  → "4,90 €"
// delivery fee                 €4.99  → "4,99 €"

test.describe("Cart — empty and seeded states", () => {
  test("empty cart shows empty state with shop link", async ({ page }) => {
    await page.goto("/cart");

    await expect(page.getByText(/your cart is empty/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /shop groceries/i })).toBeVisible();
    // Order summary must NOT appear when cart is empty
    await expect(page.getByRole("heading", { name: /order summary/i })).not.toBeVisible();
  });

  test("seeded cart shows item name, weight label, and order summary", async ({ page }) => {
    await seedCart(page, [{ productId: "p1", quantity: 1 }]);
    await page.goto("/cart");

    // Use first() — product name also appears in the suggested add-ons section
    await expect(page.getByText(/organic hass avocado/i).first()).toBeVisible();
    await expect(page.getByText(/~250g each/i)).toBeVisible();
    await expect(page.getByRole("heading", { name: /order summary/i })).toBeVisible();
    await expect(page.getByText(/delivery fee estimate/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /proceed to checkout/i })).toBeVisible();
  });

  test("shows correct line total and grand total", async ({ page }) => {
    // p1 × 2 = €8.40 subtotal  |  €8.40 + €4.99 = €13.39 grand total
    await seedCart(page, [{ productId: "p1", quantity: 2 }]);
    await page.goto("/cart");

    // Line total and subtotal are the same value — first() picks line item
    await expect(page.getByText("8,40 \u20ac").first()).toBeVisible();
    await expect(page.getByText("13,39 \u20ac")).toBeVisible();
  });

  test("multiple items show combined subtotal", async ({ page }) => {
    // p1 × 1 (€4.20) + p4 × 2 (€6.80) = €11.00  |  €11.00 + €4.99 = €15.99
    await seedCart(page, [
      { productId: "p1", quantity: 1 },
      { productId: "p4", quantity: 2 },
    ]);
    await page.goto("/cart");

    await expect(page.getByText(/organic hass avocado/i).first()).toBeVisible();
    await expect(page.getByText(/unsweetened almond milk/i).first()).toBeVisible();
    await expect(page.getByText("11,00 \u20ac")).toBeVisible();
    await expect(page.getByText("15,99 \u20ac")).toBeVisible();
  });
});

test.describe("Cart — quantity controls", () => {
  test("+ button increases quantity and recalculates line total", async ({ page }) => {
    // p4 × 1 = €3.40
    await seedCart(page, [{ productId: "p4", quantity: 1 }]);
    await page.goto("/cart");

    await expect(page.getByText("3,40 \u20ac").first()).toBeVisible();
    await page.getByRole("button", { name: "+" }).click();
    // p4 × 2 = €6.80
    await expect(page.getByText("6,80 \u20ac").first()).toBeVisible();
  });

  test("- button decreases quantity and recalculates line total", async ({ page }) => {
    // p4 × 3 = €10.20  →  after click  p4 × 2 = €6.80
    await seedCart(page, [{ productId: "p4", quantity: 3 }]);
    await page.goto("/cart");

    await expect(page.getByText("10,20 \u20ac").first()).toBeVisible();
    await page.getByRole("button", { name: "-" }).click();
    await expect(page.getByText("6,80 \u20ac").first()).toBeVisible();
  });

  test("reducing quantity to 0 removes item and shows empty state", async ({ page }) => {
    await seedCart(page, [{ productId: "p1", quantity: 1 }]);
    await page.goto("/cart");

    await expect(page.getByText(/organic hass avocado/i).first()).toBeVisible();
    await page.getByRole("button", { name: "-" }).click();
    await expect(page.getByText(/your cart is empty/i)).toBeVisible();
  });

  test("trash button removes item from cart", async ({ page }) => {
    await seedCart(page, [{ productId: "p3", quantity: 2 }]);
    await page.goto("/cart");

    await expect(page.getByText(/farm baby spinach/i).first()).toBeVisible();
    await page.getByRole("button", { name: /remove item/i }).click();
    await expect(page.getByText(/your cart is empty/i)).toBeVisible();
  });
});

test.describe("Add to cart flows", () => {
  test("adding from product grid shows floating cart button with count", async ({ page }) => {
    await page.goto("/products");

    const floatingCart = page.locator("a.fixed");
    // Cart is empty – floating button hidden
    await expect(floatingCart).not.toBeVisible();

    await page.getByRole("button", { name: /^add$/i }).first().click();

    await expect(floatingCart).toBeVisible();
    await expect(floatingCart).toContainText("1");
  });

  test("item added from product card appears in cart page", async ({ page }) => {
    await page.goto("/products");

    const avocadoCard = page.locator("article").filter({ hasText: /organic hass avocado/i }).first();
    await avocadoCard.getByRole("button", { name: /^add$/i }).click();

    // Wait for floating button — confirms React state & localStorage have updated
    await expect(page.locator("a.fixed")).toBeVisible();

    await page.goto("/cart");
    await expect(page.getByText(/organic hass avocado/i).first()).toBeVisible();
  });

  test("clicking same card multiple times increments floating cart count", async ({ page }) => {
    await page.goto("/products");

    const addBtn = page.getByRole("button", { name: /^add$/i }).first();
    await addBtn.click();
    await addBtn.click();
    await addBtn.click();

    await expect(page.locator("a.fixed")).toContainText("3");
  });

  test("adding from product detail page puts item in cart", async ({ page }) => {
    await page.goto("/products/organic-avocado-hass");

    await page.getByRole("button", { name: /add to cart/i }).click();

    // Wait for floating button before navigating
    await expect(page.locator("a.fixed")).toBeVisible();

    await page.goto("/cart");
    await expect(page.getByText(/organic hass avocado/i).first()).toBeVisible();
  });

  test("suggested add-on button adds product to cart", async ({ page }) => {
    // Seed with spinach so the cart + suggested add-ons section renders
    await seedCart(page, [{ productId: "p3", quantity: 1 }]);
    await page.goto("/cart");

    const floatingCart = page.locator("a.fixed");
    await expect(floatingCart).toContainText("1");

    // First add-on button is Organic Hass Avocado (products[0])
    await page.locator("article").filter({ hasText: /suggested add-ons/i })
      .getByRole("button").first().click();

    // Total cart count is now 2
    await expect(floatingCart).toContainText("2");
  });
});
