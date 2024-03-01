import { expect, test } from "@playwright/test";

test("Home", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  await expect(
    page.getByRole("heading", { name: "株式会社キーザンキーザン" }),
    "店名が出ている",
  )
    .toBeVisible();
});
