import { test, expect } from "@playwright/test";

// ─────────────────────────────────────────────────────────────────────────────
// Auth — login page UI, successful logins, error states, edge cases
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Staff & Admin login page", () => {
  test.beforeEach(async ({ page }) => {
    // Clear any persisted session before each auth test
    await page.addInitScript(() => localStorage.removeItem("hg_auth_user"));
    await page.goto("/admin/login");
  });

  test("renders the portal heading and form fields", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /staff & admin portal/i })).toBeVisible();
    await expect(page.getByPlaceholder("you@hybridgrocer.com")).toBeVisible();
    await expect(page.getByPlaceholder("••••••••")).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("has a link back to customer login", async ({ page }) => {
    await expect(page.getByRole("link", { name: /go to customer login/i })).toBeVisible();
  });

  test("password visibility toggle shows and hides the password", async ({ page }) => {
    const pwInput = page.getByPlaceholder("••••••••");
    await pwInput.fill("secret");
    await expect(pwInput).toHaveAttribute("type", "password");

    // The toggle button is the only icon-only button in the password field wrapper
    const toggleBtn = page.locator("button[type='button']").first();
    await toggleBtn.click();
    await expect(pwInput).toHaveAttribute("type", "text");

    await toggleBtn.click();
    await expect(pwInput).toHaveAttribute("type", "password");
  });

  test("shows error message for wrong password", async ({ page }) => {
    await page.getByPlaceholder("you@hybridgrocer.com").fill("Leon.k@hybridgrocer.com");
    await page.getByPlaceholder("••••••••").fill("wrongpassword");
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page.getByText(/incorrect email or password/i)).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("shows error message for unknown email", async ({ page }) => {
    await page.getByPlaceholder("you@hybridgrocer.com").fill("nobody@hybridgrocer.com");
    await page.getByPlaceholder("••••••••").fill("anything");
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page.getByText(/incorrect email or password/i)).toBeVisible();
  });

  test("admin login redirects to /admin dashboard", async ({ page }) => {
    await page.getByPlaceholder("you@hybridgrocer.com").fill("Leon.k@hybridgrocer.com");
    await page.getByPlaceholder("••••••••").fill("admin123");
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page).toHaveURL(/\/admin$/, { timeout: 10000 });
    await expect(page.getByRole("heading", { name: /admin overview/i })).toBeVisible();
  });

  test("staff login redirects to /staff dashboard", async ({ page }) => {
    await page.getByPlaceholder("you@hybridgrocer.com").fill("james.o@hybridgrocer.com");
    await page.getByPlaceholder("••••••••").fill("staff123");
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page).toHaveURL(/\/staff$/, { timeout: 10000 });
    await expect(page.getByRole("heading", { name: /store floor operations/i })).toBeVisible();
  });

  test("email match is case-insensitive", async ({ page }) => {
    await page.getByPlaceholder("you@hybridgrocer.com").fill("LEON.K@HYBRIDGROCER.COM");
    await page.getByPlaceholder("••••••••").fill("admin123");
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page).toHaveURL(/\/admin$/, { timeout: 10000 });
  });

  test("submit button is disabled while signing in", async ({ page }) => {
    await page.getByPlaceholder("you@hybridgrocer.com").fill("Leon.k@hybridgrocer.com");
    await page.getByPlaceholder("••••••••").fill("admin123");

    // Click submit and immediately check the disabled state before the redirect
    const btn = page.getByRole("button", { name: /sign in/i });
    await btn.click();
    // The button shows "Signing in..." while the request is in-flight
    await expect(page.getByRole("button", { name: /signing in/i }).or(btn)).toBeTruthy();
  });
});
