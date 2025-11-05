import { test, expect } from "@playwright/test";

test("protected route redirects to login", async ({ page }) => {
  await page.goto("/dashboard");

  // Should redirect to login
  await expect(page).toHaveURL(/\/login/);
});
