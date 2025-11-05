import { test as setup } from "@playwright/test";

const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
  // This setup will be skipped during actual test runs
  // You can add authentication logic here if needed
  await page.goto("http://localhost:3000/login");
  // Save signed-in state
  await page.context().storageState({ path: authFile });
});
