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
});
