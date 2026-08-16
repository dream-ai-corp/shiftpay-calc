import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const base = "http://127.0.0.1:3456";
const outDir = "/tmp/shiftpay-verify";
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const errors = [];

async function checkPage(page, path, expectText) {
  const res = await page.goto(base + path, { waitUntil: "networkidle" });
  if (!res || res.status() !== 200) errors.push(`${path} status ${res?.status()}`);
  const body = (await page.locator("body").innerText()).toLowerCase();
  for (const t of expectText) {
    if (!body.includes(t.toLowerCase())) errors.push(`${path} missing: ${t}`);
  }
  const pageErrors = [];
  page.on("pageerror", (e) => pageErrors.push(String(e)));
  if (pageErrors.length) errors.push(`${path} pageerror: ${pageErrors.join("; ")}`);
}

try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (e) => consoleErrors.push(String(e)));

  await checkPage(page, "/", [
    "How much of your overtime is actually untaxed?",
    "Hourly rate",
    "Federal tax you may keep",
    "Schedule 1-A deduction",
  ]);

  const before = await page.locator(".led").first().innerText();
  await page.locator("#ot-rate").fill("40");
  await page.locator("#ot-hours").fill("200");
  await page.waitForTimeout(150);
  const after = await page.locator(".led").first().innerText();
  if (before === after) errors.push(`home result did not change (${before})`);
  if (!/^\$\d/.test(after.replace(/\s/g, ""))) errors.push(`home result not money: ${after}`);

  await page.screenshot({ path: `${outDir}/home-desktop.png`, fullPage: true });

  await page.locator("#ot-status").selectOption("mfs");
  await page.waitForTimeout(100);
  const mfs = await page.locator("body").innerText();
  if (!mfs.includes("Married filing separately cannot claim")) {
    errors.push("MFS blocked message missing");
  }

  await checkPage(page, "/no-tax-on-tips-calculator", [
    "How much of your tips can you deduct?",
    "Typical weekly tips",
    "$25,000",
  ]);
  await page.screenshot({ path: `${outDir}/tips-desktop.png`, fullPage: true });

  await checkPage(page, "/night-shift-differential-calculator", [
    "Base hourly rate",
    "Extra pay this week",
  ]);

  await checkPage(page, "/california-overtime-calculator", [
    "Daily 8, daily 12",
    "Mon hours",
    "Gross pay this week",
  ]);

  await checkPage(page, "/timesheet-calculator", [
    "Clock hours",
    "Unpaid lunch",
    "Missed meal",
  ]);

  await checkPage(page, "/methodology", ["How the numbers are built", "Notice 2025-69"]);
  await checkPage(page, "/privacy", ["Your hours stay on this device"]);
  await checkPage(page, "/terms", ["Estimates. Not advice."]);
  await checkPage(page, "/about", ["punch clock"]);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.screenshot({ path: `${outDir}/home-mobile.png`, fullPage: true });
  const mobileCalc = await page.locator("#ot-rate").isVisible();
  if (!mobileCalc) errors.push("mobile: hourly rate not visible");

  if (consoleErrors.length) {
    errors.push("console: " + consoleErrors.join(" | "));
  }

  console.log("BEFORE", before);
  console.log("AFTER", after);
  console.log("CONSOLE", consoleErrors.length ? consoleErrors : "none");
  if (errors.length) {
    console.error("FAIL\n" + errors.join("\n"));
    process.exit(1);
  }
  console.log("PASS all browser checks");
} finally {
  await browser.close();
}
