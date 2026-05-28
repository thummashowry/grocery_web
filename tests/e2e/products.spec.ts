import { test, expect } from "@playwright/test";

test.describe("Product discovery and detail", () => {
  test("products page renders filters, search, sorting, and grid", async ({ page }) => {
    await page.goto("/products");

    await expect(page.getByPlaceholder(/search products/i)).toBeVisible();
    const sortSelect = page.locator("select").first();
    await expect(sortSelect).toBeVisible();
    await expect(sortSelect).toHaveValue("Sort: Recommended");
    await expect(page.getByText(/organic hassle avocado|organic hass avocado/i)).toBeVisible();
  });

  test("can open product detail and see nutrition, stock, and delivery estimate", async ({ page }) => {
    await page.goto("/products/organic-avocado-hass");
    await expect(page).toHaveURL(/\/products\/organic-avocado-hass$/);

    await expect(page.getByRole("heading", { name: /organic hass avocado/i })).toBeVisible();
    await expect(page.getByText(/nutritional information/i)).toBeVisible();
    await expect(page.getByText(/real-time stock/i)).toBeVisible();
    await expect(page.getByText(/delivery estimate/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /^add to cart$/i })).toBeVisible();
  });

  test("all six products render on the products page", async ({ page }) => {
    await page.goto("/products");

    await expect(page.getByText(/organic hass avocado/i)).toBeVisible();
    await expect(page.getByText(/wild blueberries/i)).toBeVisible();
    await expect(page.getByText(/farm baby spinach/i)).toBeVisible();
    await expect(page.getByText(/unsweetened almond milk/i)).toBeVisible();
    await expect(page.getByText(/stoneground sourdough/i)).toBeVisible();
    await expect(page.getByText(/greek yogurt/i)).toBeVisible();
  });

  test("out-of-stock product has disabled Add button", async ({ page }) => {
    await page.goto("/products");

    const sourdoughCard = page.locator("article").filter({ hasText: /stoneground sourdough/i });
    await expect(sourdoughCard.getByRole("button", { name: /^add$/i })).toBeDisabled();
  });

  test("product card image link navigates to detail page", async ({ page }) => {
    await page.goto("/products");

    const avocadoCard = page.locator("article").filter({ hasText: /organic hass avocado/i }).first();
    await avocadoCard.getByRole("link").click();

    await expect(page).toHaveURL(/\/products\/organic-avocado-hass$/);
    await expect(page.getByRole("heading", { name: /organic hass avocado/i })).toBeVisible();
  });

  test("out-of-stock product detail shows disabled add button", async ({ page }) => {
    await page.goto("/products/sourdough-loaf");

    await expect(page.getByRole("heading", { name: /stoneground sourdough/i })).toBeVisible();
    // Button text changes to "Out of stock" and is disabled
    await expect(page.getByRole("button", { name: /out of stock/i })).toBeDisabled();
  });
});
