import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("shows premium storefront sections", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: /grocery quality you can feel/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /featured categories/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /popular this week/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /delivery slot availability/i })).toBeVisible();

    await expect(page.getByRole("button", { name: /fruits/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /shop groceries/i })).toBeVisible();
  });

  test("mobile navigation exposes core routes", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Mobile bottom nav is only shown on mobile viewports");

    await page.goto("/");
    await page.getByRole("link", { name: /^shop$/i }).click();
    await expect(page).toHaveURL(/\/products$/);

    await page.getByRole("link", { name: /^cart$/i }).click();
    await expect(page).toHaveURL(/\/cart$/);
  });
});
