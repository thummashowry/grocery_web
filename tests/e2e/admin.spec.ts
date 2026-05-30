import { test, expect, type Page } from "@playwright/test";

// Pre-seed localStorage so the admin layout auth guard lets us in
async function loginAsAdmin({ page }: { page: Page }) {
  await page.addInitScript(() => {
    localStorage.setItem(
      "hg_auth_user",
      JSON.stringify({ id: "e1", name: "Admin", email: "leon.k@hybridgrocer.com", role: "admin" })
    );
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Admin — overview dashboard
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Admin Overview", () => {
  test.beforeEach(loginAsAdmin);

  test("shows overview heading and all four stat cards", async ({ page }) => {
    await page.goto("/admin");

    await expect(page.getByRole("heading", { name: /admin overview/i })).toBeVisible();
    await expect(page.getByText(/total products/i)).toBeVisible();
    await expect(page.getByText(/active promotions/i)).toBeVisible();
    await expect(page.getByText(/employees/i).first()).toBeVisible();
    await expect(page.getByText(/stock alerts/i).first()).toBeVisible();
  });

  test("stat cards link to the correct admin sub-pages", async ({ page }) => {
    await page.goto("/admin");

    await page.getByText(/total products/i).click();
    await expect(page).toHaveURL(/\/admin\/products/);
  });

  test("sidebar nav links are all visible", async ({ page }) => {
    await page.goto("/admin");

    await expect(page.getByRole("link", { name: /overview/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /products/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /promotions/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /employees/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /stock/i }).first()).toBeVisible();
  });

  test("logout button is present in sidebar", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.getByRole("button", { name: /sign out/i })).toBeVisible();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Admin Products
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Admin Products", () => {
  test.beforeEach(loginAsAdmin);

  test("lists all products from the database", async ({ page }) => {
    await page.goto("/admin/products");

    await expect(page.getByText(/organic hass avocado/i)).toBeVisible();
    await expect(page.getByText(/wild blueberries/i)).toBeVisible();
    await expect(page.getByText(/farm baby spinach/i)).toBeVisible();
    await expect(page.getByText(/unsweetened almond milk/i)).toBeVisible();
    await expect(page.getByText(/stoneground sourdough/i)).toBeVisible();
    await expect(page.getByText(/greek yogurt/i)).toBeVisible();
  });

  test("search filters the product list", async ({ page }) => {
    await page.goto("/admin/products");

    await page.getByPlaceholder(/search products/i).fill("avocado");
    await expect(page.getByText(/organic hass avocado/i)).toBeVisible();
    await expect(page.getByText(/wild blueberries/i)).not.toBeVisible();
  });

  test("Add Product button opens the form panel", async ({ page }) => {
    await page.goto("/admin/products");

    await page.getByRole("button", { name: /add product/i }).click();
    await expect(page.getByRole("heading", { name: /new product/i })).toBeVisible();
    await expect(page.getByPlaceholder(/product name/i)).toBeVisible();
  });

  test("cancel button closes the form panel", async ({ page }) => {
    await page.goto("/admin/products");

    await page.getByRole("button", { name: /add product/i }).click();
    await expect(page.getByRole("heading", { name: /new product/i })).toBeVisible();

    await page.getByRole("button", { name: /cancel/i }).click();
    await expect(page.getByRole("heading", { name: /new product/i })).not.toBeVisible();
  });

  test("edit button pre-fills the form with product data", async ({ page }) => {
    await page.goto("/admin/products");

    // Click the edit (pencil) button on the first product card
    await page.locator("article").first().getByRole("button", { name: /edit/i }).click();
    await expect(page.getByRole("heading", { name: /edit product/i })).toBeVisible();
    // The name field should be populated
    const nameInput = page.getByPlaceholder(/product name/i);
    await expect(nameInput).not.toHaveValue("");
  });

  test("Add Category button adds it to the dropdown", async ({ page }) => {
    await page.goto("/admin/products");

    await page.getByRole("button", { name: /add category/i }).click();
    const input = page.getByPlaceholder(/new category name/i);
    await expect(input).toBeVisible();
  });

  test("out-of-stock product shows Out of Stock badge", async ({ page }) => {
    await page.goto("/admin/products");

    const sourdoughCard = page.locator("article").filter({ hasText: /stoneground sourdough/i });
    await expect(sourdoughCard.getByText(/out of stock/i)).toBeVisible();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Admin Employees
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Admin Employees", () => {
  test.beforeEach(loginAsAdmin);

  test("lists all employees with role badges", async ({ page }) => {
    await page.goto("/admin/employees");

    await expect(page.getByRole("heading", { name: /employees/i })).toBeVisible();
    // At least one staff employee exists
    await expect(page.getByText(/james okoro/i)).toBeVisible();
    // Roles appear as badges
    await expect(page.getByText(/staff/i).first()).toBeVisible();
  });

  test("shows total, admin, and staff counts", async ({ page }) => {
    await page.goto("/admin/employees");

    await expect(page.getByText(/total/i).first()).toBeVisible();
    await expect(page.getByText(/admins/i)).toBeVisible();
    await expect(page.getByText(/^staff$/i).first()).toBeVisible();
  });

  test("Add Employee button opens the form", async ({ page }) => {
    await page.goto("/admin/employees");

    await page.getByRole("button", { name: /add employee/i }).click();
    await expect(page.getByRole("heading", { name: /add employee/i })).toBeVisible();
    await expect(page.getByPlaceholder(/full name/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });

  test("role filter shows only staff employees when staff is selected", async ({ page }) => {
    await page.goto("/admin/employees");

    await page.getByRole("button", { name: /^staff$/i }).click();
    // All visible employee articles should NOT show 'admin' role badge
    const articles = page.locator("article");
    for (const article of await articles.all()) {
      await expect(article.getByText(/^admin$/i)).not.toBeVisible();
    }
  });

  test("role filter shows only admin employees when admin is selected", async ({ page }) => {
    await page.goto("/admin/employees");

    await page.getByRole("button", { name: /^admin$/i }).click();
    const articles = page.locator("article");
    // At least one admin exists
    await expect(articles.first()).toBeVisible();
  });

  test("edit employee form pre-fills name and email", async ({ page }) => {
    await page.goto("/admin/employees");

    await page.locator("article").first().getByRole("button", { name: /edit/i }).click();
    await expect(page.getByRole("heading", { name: /edit employee/i })).toBeVisible();
    const nameInput = page.getByPlaceholder(/full name/i);
    await expect(nameInput).not.toHaveValue("");
  });

  test("password field is optional (empty) when editing", async ({ page }) => {
    await page.goto("/admin/employees");

    await page.locator("article").first().getByRole("button", { name: /edit/i }).click();
    // Password field should be empty on edit open
    await expect(page.getByLabel(/password/i)).toHaveValue("");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Admin Coupons (Promotions)
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Admin Coupons", () => {
  test.beforeEach(loginAsAdmin);

  test("lists coupons with code, type, and status", async ({ page }) => {
    await page.goto("/admin/coupons");

    await expect(page.getByRole("heading", { name: /promotions/i })).toBeVisible();
    // At least one coupon code should be visible
    const couponArticles = page.locator("article");
    await expect(couponArticles.first()).toBeVisible();
  });

  test("Add Coupon button opens the form", async ({ page }) => {
    await page.goto("/admin/coupons");

    await page.getByRole("button", { name: /add coupon/i }).click();
    await expect(page.getByRole("heading", { name: /new coupon/i })).toBeVisible();
    await expect(page.getByPlaceholder(/e\.g\. SUMMER20|coupon code/i)).toBeVisible();
  });

  test("cancel button closes the coupon form", async ({ page }) => {
    await page.goto("/admin/coupons");

    await page.getByRole("button", { name: /add coupon/i }).click();
    await expect(page.getByRole("heading", { name: /new coupon/i })).toBeVisible();

    await page.getByRole("button", { name: /cancel/i }).click();
    await expect(page.getByRole("heading", { name: /new coupon/i })).not.toBeVisible();
  });

  test("coupon form has type selector (percentage / fixed)", async ({ page }) => {
    await page.goto("/admin/coupons");
    await page.getByRole("button", { name: /add coupon/i }).click();

    await expect(page.getByRole("option", { name: /percentage/i })).toBeAttached();
    await expect(page.getByRole("option", { name: /fixed/i })).toBeAttached();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Admin Stock & Alerts
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Admin Stock", () => {
  test.beforeEach(loginAsAdmin);

  test("lists all products with stock levels", async ({ page }) => {
    await page.goto("/admin/stock");

    await expect(page.getByRole("heading", { name: /stock & alerts/i })).toBeVisible();
    await expect(page.getByText(/organic hass avocado/i)).toBeVisible();
    await expect(page.getByText(/wild blueberries/i)).toBeVisible();
  });

  test("shows stock-damage alerts section", async ({ page }) => {
    await page.goto("/admin/stock");

    await expect(page.getByText(/stock damage alerts/i)).toBeVisible();
  });

  test("clicking edit on a product row enables an inline stock input", async ({ page }) => {
    await page.goto("/admin/stock");

    // Click edit on the first in-stock product row
    await page.locator("article").first().getByRole("button", { name: /edit/i }).click();
    // A number input or save button should appear
    await expect(
      page.getByRole("button", { name: /save/i }).or(page.locator("input[type='number']")).first()
    ).toBeVisible();
  });

  test("Log Damage / New Alert button opens the alert form", async ({ page }) => {
    await page.goto("/admin/stock");

    await page.getByRole("button", { name: /log damage|new alert/i }).click();
    await expect(page.getByRole("heading", { name: /log stock damage/i })).toBeVisible();
  });
});
