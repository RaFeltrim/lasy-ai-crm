import { test, expect } from "@playwright/test";

test("home shows login with heading Lasy CRM", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /Lasy CRM/i })).toBeVisible();
});

test("login page has Email and Senha labels", async ({ page }) => {
  await page.goto("/login");

  await expect(page.getByText("Email")).toBeVisible();
  await expect(page.getByText("Senha")).toBeVisible();
});
