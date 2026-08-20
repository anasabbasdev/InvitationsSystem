import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const outDir = join("..", "design-source", "wedding-psd-01", "reference", "implementation");
const reportDir = join(outDir, "fidelity-390");
mkdirSync(outDir, { recursive: true });
mkdirSync(reportDir, { recursive: true });

const widths = [348, 390, 430];
const url = "http://localhost:3000/i/mhmd_lara";

const browser = await chromium.launch({ headless: true });

for (const width of widths) {
  const page = await browser.newPage({
    viewport: { width, height: 844 },
    deviceScaleFactor: 2,
  });
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(800);
  await page.screenshot({ path: join(outDir, `opening-${width}.png`), fullPage: false });

  await page.locator('button[aria-label="افتح الدعوة"]').click();
  await page.waitForTimeout(700);
  if (width === 390) {
    await page.screenshot({ path: join(reportDir, "opening-video-390.png"), fullPage: false });
  }

  await page.waitForTimeout(4500);
  await page.screenshot({ path: join(outDir, `opened-${width}.png`), fullPage: true });

  if (width === 390) {
    const shots = [
      ["invite-names-390.png", 0.12],
      ["countdown-390.png", 0.28],
      ["timeline-390.png", 0.52],
      ["notes-390.png", 0.66],
      ["location-390.png", 0.74],
      ["closing-390.png", 0.92],
    ];
    const scrollH = await page.evaluate(() => document.documentElement.scrollHeight);
    for (const [name, ratio] of shots) {
      await page.evaluate((y) => window.scrollTo(0, y), Math.round(scrollH * ratio - 200));
      await page.waitForTimeout(450);
      await page.screenshot({ path: join(reportDir, name), fullPage: false });
    }
  }

  await page.close();
  console.log("captured", width);
}

await browser.close();
console.log("done", outDir);
