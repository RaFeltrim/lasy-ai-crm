import { test, expect } from "@playwright/test";

test("login renders placeholders and Entrar button", async ({ page }) => {
  await page.goto("/login");

  await expect(page.getByPlaceholder(/you@example.com/i)).toBeVisible();
  await expect(page.getByPlaceholder(/••••••••/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /Entrar/i })).toBeVisible();
});
