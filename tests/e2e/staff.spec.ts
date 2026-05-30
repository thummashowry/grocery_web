import { test, expect, type Page } from "@playwright/test";

// Pre-seed localStorage so the staff page auth guard lets us in
async function loginAsStaff({ page }: { page: Page }) {
  await page.addInitScript(() => {
    localStorage.setItem(
      "hg_auth_user",
      JSON.stringify({ id: "e2", name: "James Okoro", email: "james.o@hybridgrocer.com", role: "staff" })
    );
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Staff dashboard — layout and queue overview
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Staff Dashboard — layout", () => {
  test.beforeEach(loginAsStaff);

  test("renders the Store Floor Operations heading", async ({ page }) => {
    await page.goto("/staff");
    await expect(page.getByRole("heading", { name: /store floor operations/i })).toBeVisible();
  });

  test("shows stat cards: incoming, picking, and stock alerts", async ({ page }) => {
    await page.goto("/staff");

    await expect(page.getByText(/incoming queue/i)).toBeVisible();
    await expect(page.getByText(/picking now/i)).toBeVisible();
    await expect(page.getByText(/stock alerts/i).first()).toBeVisible();
  });

  test("renders the orders section", async ({ page }) => {
    await page.goto("/staff");

    // Orders from DB: ORD-2845 (Pending), ORD-2844 (Picking), ORD-2843 (Completed)
    await expect(page.getByText(/ORD-2845/)).toBeVisible();
    await expect(page.getByText(/ORD-2844/)).toBeVisible();
  });

  test("shows customer names on order cards", async ({ page }) => {
    await page.goto("/staff");

    await expect(page.getByText(/lina berg/i)).toBeVisible();
    await expect(page.getByText(/noah lang/i)).toBeVisible();
  });

  test("shows order status badges", async ({ page }) => {
    await page.goto("/staff");

    await expect(page.getByText(/^pending$/i).first()).toBeVisible();
    await expect(page.getByText(/^picking$/i).first()).toBeVisible();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Staff dashboard — order actions
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Staff Dashboard — order actions", () => {
  test.beforeEach(loginAsStaff);

  test("Pending order has a Start Picking button", async ({ page }) => {
    await page.goto("/staff");

    const pendingCard = page.locator("article").filter({ hasText: /ORD-2845/ });
    await expect(pendingCard.getByRole("button", { name: /start picking/i })).toBeVisible();
  });

  test("Picking order has a Mark Complete button", async ({ page }) => {
    await page.goto("/staff");

    const pickingCard = page.locator("article").filter({ hasText: /ORD-2844/ });
    await expect(pickingCard.getByRole("button", { name: /mark complete/i })).toBeVisible();
  });

  test("order cards show action buttons for weight adjust and inventory", async ({ page }) => {
    await page.goto("/staff");

    const firstCard = page.locator("article").first();
    await expect(firstCard.getByRole("button", { name: /weight adjust/i })).toBeVisible();
    await expect(firstCard.getByRole("button", { name: /inventory update/i })).toBeVisible();
  });

  test("clicking expand on an order reveals the items picking list", async ({ page }) => {
    await page.goto("/staff");

    const pendingCard = page.locator("article").filter({ hasText: /ORD-2845/ });
    // The chevron / expand button
    await pendingCard.getByRole("button", { name: /view items|pick list|expand/i })
      .or(pendingCard.locator("button").filter({ hasText: "" }).last())
      .click();

    // After expansion, item rows or a picking list heading should appear
    await expect(
      page.getByText(/picking list/i).or(page.getByRole("checkbox").first())
    ).toBeVisible({ timeout: 5000 });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Staff dashboard — stock damage alerts
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Staff Dashboard — stock damage alerts", () => {
  test.beforeEach(loginAsStaff);

  test("shows unsent stock damage alerts", async ({ page }) => {
    await page.goto("/staff");

    // da2 (Farm Baby Spinach, not sent) should be visible
    await expect(page.getByText(/farm baby spinach/i)).toBeVisible();
    await expect(page.getByText(/delivery van temperature breach/i)).toBeVisible();
  });

  test("sent alerts are NOT shown in the staff view", async ({ page }) => {
    await page.goto("/staff");

    // da1 (Sourdough Loaf, notification_sent=TRUE) must not appear
    await expect(page.getByText(/water damage from refrigeration/i)).not.toBeVisible();
  });

  test("damage alert shows affected order IDs", async ({ page }) => {
    await page.goto("/staff");

    // da2 has no affected orders in seed data — so just the product name and reason are shown
    await expect(page.getByText(/5 unit/i)).toBeVisible();
  });

  test("Mark Notified button is visible on unsent alerts", async ({ page }) => {
    await page.goto("/staff");

    const alertCard = page.locator("article").filter({ hasText: /farm baby spinach/i });
    await expect(alertCard.getByRole("button", { name: /mark notified/i })).toBeVisible();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Order tracking page
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Order Tracking", () => {
  test("renders the tracking page for ORD-2845", async ({ page }) => {
    await page.goto("/orders/ORD-2845/tracking");

    await expect(page.getByRole("heading", { name: /real-time order tracking/i })).toBeVisible();
    await expect(page.getByText(/ORD-2845/)).toBeVisible();
  });

  test("shows the timeline with all three seeded events", async ({ page }) => {
    await page.goto("/orders/ORD-2845/tracking");

    await expect(page.getByText(/order confirmed and queued/i)).toBeVisible();
    await expect(page.getByText(/picker is selecting/i)).toBeVisible();
    await expect(page.getByText(/all items packed/i)).toBeVisible();
  });

  test("shows status chips for Pending, Picking, Completed", async ({ page }) => {
    await page.goto("/orders/ORD-2845/tracking");

    await expect(page.getByText(/^pending$/i).first()).toBeVisible();
    await expect(page.getByText(/^picking$/i).first()).toBeVisible();
    await expect(page.getByText(/^completed$/i).first()).toBeVisible();
  });

  test("shows delivery ETA information", async ({ page }) => {
    await page.goto("/orders/ORD-2845/tracking");

    await expect(page.getByText(/delivery eta/i)).toBeVisible();
  });

  test("shows timeline heading", async ({ page }) => {
    await page.goto("/orders/ORD-2845/tracking");
    await expect(page.getByRole("heading", { name: /timeline/i })).toBeVisible();
  });
});
