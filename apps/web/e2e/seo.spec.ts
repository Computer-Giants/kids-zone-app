import { expect, test } from "@playwright/test";

test.describe("Brand Assets and SEO Metadata Architecture (covers: AC-1, AC-2, AC-3, AC-4, AC-5, AC-6)", () => {
  test("robots.txt serves privacy rules and sitemap pointer", async ({ request }) => {
    const res = await request.get("/robots.txt");
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain("User-Agent: *");
    expect(body).toContain("Disallow: /parent/");
    expect(body).toContain("Disallow: /select-profile/");
    expect(body).toContain("Disallow: /api/");
    expect(body).toContain("Sitemap: ");
    expect(body).toContain("/sitemap.xml");
  });

  test("sitemap.xml publishes canonical public URLs", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain("<urlset");
    expect(body).toContain("/login");
    expect(body).toContain("/signup");
    expect(body).toContain("/bible");
    expect(body).toContain("/saints");
    expect(body).toContain("/fun");
    expect(body).not.toContain("/parent");
    expect(body).not.toContain("/api");
  });

  test("web manifest serves valid PWA branding and theme colors", async ({ request }) => {
    const res = await request.get("/manifest.webmanifest");
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.name).toBe("Kid Zone · Catholic Learning for Children");
    expect(json.short_name).toBe("Kid Zone");
    expect(json.theme_color).toBe("#FF7A1A");
    expect(json.background_color).toBe("#FFF1D6");
    expect(json.display).toBe("standalone");
    expect(json.icons.length).toBeGreaterThan(0);
  });

  test("browser icons resolve with HTTP 200", async ({ request }) => {
    const faviconRes = await request.get("/favicon.ico");
    expect(faviconRes.status()).toBe(200);

    const appleIconRes = await request.get("/apple-icon.png");
    expect(appleIconRes.status()).toBe(200);

    const iconSvgRes = await request.get("/icon.svg");
    expect(iconSvgRes.status()).toBe(200);
  });

  test("home page renders Open Graph, Twitter cards, and JSON-LD schema", async ({ page }) => {
    await page.goto("/");

    // Verify Open Graph tags
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute("content", /Kid Zone/);

    const ogImage = page.locator('meta[property="og:image"]');
    await expect(ogImage).toHaveAttribute("content", /og-website\.png/);

    // Verify Twitter card
    const twitterCard = page.locator('meta[name="twitter:card"]');
    await expect(twitterCard).toHaveAttribute("content", "summary_large_image");

    // Verify JSON-LD script
    const jsonLdScript = page.locator('script[type="application/ld+json"]');
    await expect(jsonLdScript).toBeAttached();
    const jsonLdContent = await jsonLdScript.textContent();
    expect(jsonLdContent).toContain("EducationalOrganization");
    expect(jsonLdContent).toContain("Kid Zone");
  });
});
