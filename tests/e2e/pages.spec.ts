import { expect, test, type Page } from "@playwright/test";

// Console errors that are not caused by the page itself.
const IGNORED_CONSOLE = [/Failed to load resource: the server responded with a status of 404/, /googletagmanager|google-analytics/];

function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error" && !IGNORED_CONSOLE.some((re) => re.test(message.text()))) {
      errors.push(`console: ${message.text()}`);
    }
  });
  return errors;
}

const PAGES = [
  { path: "/", name: "homepage" },
  { path: "/services/web-design", name: "Web Design service" },
  { path: "/works", name: "Work index" },
  { path: "/works/flyup-line", name: "case study" },
  { path: "/blog/how-to-choose-a-web-design-agency", name: "blog article" }
];

for (const { path, name } of PAGES) {
  test(`${name} renders without errors (${path})`, async ({ page }) => {
    const errors = collectErrors(page);
    const response = await page.goto(path, { waitUntil: "networkidle" });
    expect(response?.status()).toBe(200);

    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("main")).toHaveCount(1);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(new URL(canonical ?? "").pathname).toBe(path);
    await expect(page.locator("header nav a[href='/works']").first()).toBeAttached();
    await expect(page.locator("footer").last()).toBeAttached();

    // No horizontal page scroll (mobile layout regression guard).
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);

    // Hydration errors (#418 etc.) and runtime exceptions surface here.
    await page.waitForTimeout(500);
    expect(errors).toEqual([]);
  });
}

test("contact form UI is present and labelled (not submitted)", async ({ page }) => {
  const errors = collectErrors(page);
  await page.route("**/api/leads", (route) => route.abort()); // Belt and braces: never create a lead.
  const response = await page.goto("/contact", { waitUntil: "networkidle" });
  expect(response?.status()).toBe(200);

  const form = page.getByRole("form", { name: "Project inquiry form" });
  await expect(form).toBeVisible();
  for (const id of ["contact-name", "contact-email", "contact-message"]) {
    await expect(form.locator(`#${id}`)).toBeVisible();
    await expect(form.locator(`label[for="${id}"]`)).toBeAttached();
  }
  await expect(form.locator('button[type="submit"]')).toBeEnabled();
  await page.locator("#contact-name").fill("Playwright check");
  await expect(page.locator("#contact-name")).toHaveValue("Playwright check");
  expect(errors).toEqual([]);
});

test("unknown URL shows the noindex 404 page", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist-e2e");
  expect(response?.status()).toBe(404);
  // Next.js adds its own noindex tag on 404s alongside ours; every robots tag must say noindex.
  const robots = await page.locator('meta[name="robots"]').evaluateAll((tags) => tags.map((t) => t.getAttribute("content") ?? ""));
  expect(robots.length).toBeGreaterThan(0);
  for (const content of robots) expect(content).toMatch(/noindex/);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator("a[href='/']").first()).toBeAttached();
});
